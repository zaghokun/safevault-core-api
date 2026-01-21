import { Injectable, NotFoundException, InternalServerErrorException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTopupDto } from './dto/create-topup.dto';
import { TransferDto } from './dto/transfrer.dto';
import * as bcrypt from 'bcrypt';

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

    async transfer(senderUserId: string, transferDto: TransferDto){
        const {toWalletId, amount, pin, description} = transferDto;
        // ----------------- SENDER -----------------------
        const senderWallet = await this.prisma.wallet.findUnique({
            where: {userId: senderUserId},
        });
        if (!senderWallet) throw new NotFoundException('Dompet pengirim tidak ditemukan');

        if (!senderWallet.pin) throw new NotFoundException('Anda belum memiliki pin')
        const isPinValid = await bcrypt.compare(pin, senderWallet.pin);
        if (!isPinValid) throw new UnauthorizedException('PIN Salah!');

        if (Number(senderWallet.balance) < amount) throw new BadRequestException('Saldo tidak cukup');

        if (senderWallet.id === toWalletId) throw new BadRequestException('Tidak bisa transfer ke diri sendiri');
        // ---------------------------------------------------------

        // ----------------- RECIEPIENT -----------------------
        const receiverWallet = await this.prisma.wallet.findUnique({
            where: {id: toWalletId},
        });
        if (!receiverWallet) throw new NotFoundException('Dompet tujuan tidak ditemukan');

        return this.prisma.$transaction(async (tx) => {
            const senderBalanceBefore = Number(senderWallet.balance);
            const senderBalanceAfter = senderBalanceBefore - amount;

            const receiverBalanceBefore = Number(receiverWallet.balance);
            const receiverBalanceAfter = receiverBalanceBefore + amount;

            await tx.wallet.update({
                where: {id: senderWallet.id},
                data: { balance: {increment: amount}},
            });

            await tx.wallet.update({
                where: {id: receiverWallet.id},
                data: { balance: {increment: amount}},
            });

            const transaction = await tx.transaction.create({
                data: {
                    type: 'TRANSFER',
                    amount: amount,
                    status: 'SUCCESS',
                    fromWalletId: senderWallet.id,
                    toWalletId: receiverWallet.id,
                    description: description || 'Transfer user',

                    senderBalanceBeforeSnapshot: senderBalanceBefore,
                    senderBalanceAfterSnapshot: senderBalanceAfter,
                    receiverBalanceBeforeSnapshot: receiverBalanceBefore,
                    receiverBalanceAfterSnapshot: receiverBalanceAfter,
                },
            });

            return transaction;
        })
    }
}
