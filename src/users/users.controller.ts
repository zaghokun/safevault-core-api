import { Controller, Post, Body, ValidationPipe, UsePipes, UseGuards, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'http';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({whitelist: true}))
  async register(@Body() createUserDto: CreateUserDto){
    return this.usersService.register(createUserDto);
  }

  @ApiBearerAuth()

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    const userId = req.user.id;
    return this.usersService.findOne(userId);
  }
}
