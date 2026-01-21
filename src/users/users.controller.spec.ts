import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // Mock Service
  const mockUsersService = {
    register: jest.fn().mockResolvedValue({
      id: 'user-123',
      email: 'test@mail.com',
      name: 'Tester',
    }),
    getProfile: jest.fn().mockReturnValue({
      id: 'user-123',
      email: 'test@mail.com',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService, 
        },
      ],
    })
    .overrideGuard(AuthGuard('jwt')) // Bypass
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('harus terdefinisi', () => {
    expect(controller).toBeDefined();
  });

  it('harus memanggil service.register saat register', async () => {
    const dto = { email: 'a@b.com', name: 'A', password: '123', pin: '123456' };
    await controller.register(dto);
    expect(service.register).toHaveBeenCalledWith(dto);
  });
});