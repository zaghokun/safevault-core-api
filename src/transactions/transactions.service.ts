import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTopupDto } from './dto/create-topup.dto';

@Injectable()
export class TransactionsService {
    constructor(private prisma: PrismaService){}

    async topUp(userId: string, createTopupDto: CreateTopupDto){
        const {amount} = createTopupDto;

        return this.prisma.$transaction(async (tx) =>{
            const wallet = await tx.wallet.findUnique({
                where: {userId},
            });

            if(!wallet){
                throw new NotFoundException('Wallet tidak ditemukan');
            }

            const balanceBefore = wallet.balance;
            const balanceAfter = Number(balanceBefore) + amount;

            await tx.wallet.update({
                where: {id: wallet.id},
                data: {
                    balance: {increment: amount},
                },
            });

            const transactionRecord = await tx.transaction.create({
                data:{
                    amount: amount,
                    type: 'TOPUP',
                    status: 'SUCCESS',
                    toWalletId: wallet.id,

                    receiverBalanceBeforeSnapshot: balanceBefore,
                    receiverBalanceAfterSnapshot: balanceAfter,

                    description: 'Top up via Bank Transfer',
                },
            });
            return transactionRecord;
        });
    }
}
