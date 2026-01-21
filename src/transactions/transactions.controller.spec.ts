import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransactionsService = {
    topUp: jest.fn().mockResolvedValue({ id: 'transaksi-topup', status: 'SUCCESS' }),
    transfer: jest.fn().mockResolvedValue({ id: 'transaksi-transfer', status: 'SUCCESS' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    })
    .overrideGuard(AuthGuard('jwt'))
    .useValue({ canActivate: () => true }) 
    .compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('harus terdefinisi', () => {
    expect(controller).toBeDefined();
  });

  // TES 1: TOP UP
  it('harus memanggil service.topUp saat ada request', async () => {
    const req = { user: { id: 'user-123' } }; 
    const dto = { amount: 50000 };

    await controller.topUp(req, dto);
    
    expect(service.topUp).toHaveBeenCalledWith('user-123', dto);
  });

  // TES 2: TRANSFER
  it('harus memanggil service.transfer saat ada request', async () => {
    const req = { user: { id: 'user-123' } };
    const dto = { toWalletId: 'wallet-b', amount: 50000, pin: '123456' };

    await controller.transfer(req, dto);

    expect(service.transfer).toHaveBeenCalledWith('user-123', dto);
  });
});