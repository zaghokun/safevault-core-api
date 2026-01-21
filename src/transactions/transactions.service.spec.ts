import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PrismaService } from 'src/prisma.service';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('TransactionsController', () => {
  let service: TransactionsService;
  let prisma: any;

  const mockSender = {
    id: 'user-1',
    balance: 500000,
    pin: '$2b$10$EpRnTzVlqHNP0.fkbAyTn.zbBqH/..'
  };

  const mockReceiver = {
    id: 'user-2',
    balance: 0,
  };

  const mockTransferDto = {
    toWalletId: 'wallet-user-2',
    amount: 50000,
    pin: '123456'
  };

  beforeEach(async () => {
    const mockPrismaService = {
      wallet: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      transaction:{
        create: jest.fn(),
        findUnique: jest.fn(),
      },
      $transaction: jest.fn().mockImplementation((cb) => cb(mockPrismaService)),    
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {provide: PrismaService, useValue: mockPrismaService},
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('harus terdefinisi', () => {
    expect(service).toBeDefined();
  });

  // SKENARIO 1: TRANSFER SUKSES 
  it('harus berhasil transfer jika saldo cukup & pin benar', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

    prisma.wallet.findUnique
      .mockResolvedValueOnce(mockSender) 
      .mockResolvedValueOnce(mockReceiver);

    prisma.wallet.update.mockResolvedValue({}); 
    prisma.transaction.create.mockResolvedValue({ id: 'transaksi-sukses' }); 

    const result = await service.transfer('user-1', mockTransferDto);

    expect(result).toEqual({ id: 'transaksi-sukses' });
    expect(prisma.wallet.update).toHaveBeenCalledTimes(2);
  });

  // SKENARIO 2: PIN SALAH 
  it('harus error jika PIN salah', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
    
    prisma.wallet.findUnique.mockResolvedValueOnce(mockSender);

    await expect(service.transfer('user-1', mockTransferDto)).rejects.toThrow(UnauthorizedException);
  });

  // SKENARIO 3: SALDO KURANG 
  it('harus error jika saldo tidak cukup', async () => {
    const miskinSender = { ...mockSender, balance: 1000 }; 
    
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true)); 
    prisma.wallet.findUnique.mockResolvedValueOnce(miskinSender);

    await expect(service.transfer('user-1', mockTransferDto)).rejects.toThrow(BadRequestException);
  });

  // SKENARIO 4: TRANSFER KE DIRI SENDIRI
  it('harus error jika transfer ke diri sendiri', async () => {
    const dtoKeDiriSendiri = { ...mockTransferDto, toWalletId: 'user-1-wallet-id' };
    const senderWithId = { ...mockSender, id: 'user-1-wallet-id' }; 

    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
    prisma.wallet.findUnique.mockResolvedValueOnce(senderWithId);

    await expect(service.transfer('user-1', dtoKeDiriSendiri)).rejects.toThrow(BadRequestException);
  });
});
