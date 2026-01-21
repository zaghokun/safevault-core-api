import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;

  const mockPrismaService = {
    user: {
      create: jest.fn().mockResolvedValue({ id: 'user-baru', email: 'test@mail.com' }),
      findUnique: jest.fn().mockResolvedValue({ id: 'user-lama', email: 'ada@mail.com' }),
    },
    wallet: {
      create: jest.fn(), // Mock wallet creation
    },
    $transaction: jest.fn().mockImplementation((cb) => cb(mockPrismaService)),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService }, // Mock Prisma
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('harus terdefinisi', () => {
    expect(service).toBeDefined();
  });

  it('harus bisa register user baru', async () => {
    prisma.user.findUnique.mockResolvedValueOnce(null);

    const dto = { email: 'baru@mail.com', name: 'Baru', password: '123', pin: '123456' };
    const result = await service.register(dto);
    expect(result.user).toHaveProperty('id');
    expect(result.user.email).toBe('test@mail.com')
    expect(mockPrismaService.user.create).toHaveBeenCalled();
  });

  it('harus error jika email sudah ada', async () => {
    const dto = { email: 'ada@mail.com', name: 'Lama', password: '123', pin: '123456' };
    
    await expect(service.register(dto)).rejects.toThrow(ConflictException);
  });
});