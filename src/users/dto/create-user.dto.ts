import { IsEmail, isNotEmpty, minLength, isString, isEmail, IsString, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: 'Format email salah' })
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(6, {message: 'Password minimal 6 karakter'})
    password: string;

    @IsString()
    @MinLength(6, {message: 'Pin harus 6 digit'})
    pin: string;
}