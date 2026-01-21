import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  // Mock Service
  const mockAuthService = {
    login: jest.fn().mockResolvedValue({
      access_token: 'token-palsu-jwt',
      user: { id: 'u1', email: 'test@mail.com' },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService, 
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('harus terdefinisi', () => {
    expect(controller).toBeDefined();
  });

  it('harus memanggil service.login saat login', async () => {
    const dto = { email: 'test@mail.com', password: '123' };
    const result = await controller.login(dto);
    
    expect(service.login).toHaveBeenCalledWith(dto.email, dto.password);
    expect(result).toHaveProperty('access_token');
  });
});