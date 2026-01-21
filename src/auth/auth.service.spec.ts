import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// Mock Bcrypt 
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  // Mock UsersService
  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  // Mock JwtService
  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('token-rahasia-xyz'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('harus terdefinisi', () => {
    expect(service).toBeDefined();
  });

  it('harus return token jika login sukses', async () => {
    // Skenario: User ditemukan & Password benar
    mockUsersService.findByEmail.mockResolvedValue({
      id: 'u1', email: 'a@b.com', password: 'hashed-pass'
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Password match

    const result = await service.login('a@b.com', '123');

    expect(result).toHaveProperty('access_token', 'token-rahasia-xyz');
  });
});