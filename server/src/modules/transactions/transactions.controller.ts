import { GetTransactionDto } from './dto/get.dto';
import { PostTransactionDto } from './dto/post.dto';
import { TransactionService } from './transactions.service';
import { JwtData } from '../auth/strategies/access.strategy';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Jwt } from '../../common/decorators/jwt.decorator';

@Controller('transactions')
export class TransactionController {
	constructor(private transactionService: TransactionService) {}

	@Get(':id')
	async findUnique(@Param('id') id: number, @Jwt() user: JwtData) {
		return await this.transactionService.findUnique({ transaction_id: id }, user);
	}

	@Get()
	async findMany(@Query() dto: GetTransactionDto, @Jwt() user: JwtData) {
		return await this.transactionService.findMany(dto, user);
	}

	@Post()
	async create(@Body() dto: PostTransactionDto, @Jwt() user: JwtData) {
		return await this.transactionService.create(dto, user);
	}
}
