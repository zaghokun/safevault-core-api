import { Controller, Post, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({whitelist: true}))
  async register(@Body() createUserDto: CreateUserDto){
    return this.usersService.register(createUserDto);
  }
}
