import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { create } from 'domain';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService){}

    async register(createUSerDto: CreateUserDto){
        const {email, password, name, pin} = createUSerDto;
        
        // Cek apakah email sudah terdaftar
        const existingUser = await this.prisma.user.findUnique({
            where: {email},
        });

        if (existingUser){
            throw new ConflictException('Email ini sudah terdaftar!');
        }

        // hash passwrod dan pin
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedPin = await bcrypt.hash(pin, salt);

        // transaksi database (pembuatan user dan wallet)

        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                const newUser = await prisma.user.create({
                    data: {
                        email,
                        name,
                        password: hashedPassword,
                    },
                });

                await prisma.wallet.create({
                    data: {
                        userId: newUser.id,
                        balance: 0,
                        pin: hashedPin,
                    },
                });

                return newUser;
            });

            return{
                message: 'Registrasi berhasil',
                user: {
                    id: result.id,
                    email: result.email,
                    name: result.name,
                },
            };
        } catch (error){
            throw new InternalServerErrorException('Gagal membuat user: ' + error.message);
        }
    }

    async findByEmail(email: string){
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
}
