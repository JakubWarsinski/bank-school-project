import { GetAccountDto } from './dto/get.dto';
import { AddAccountDto } from './dto/add.dto';
import { PostAccountDto } from './dto/post.dto';
import { AccountService } from './account.service';
import { Controller, Param, Patch, Get, Query, Post, Body } from '@nestjs/common';
import { PatchAccountDto, PatchAccountDtoPolicy } from './dto/patch.dto';
import { JwtData } from '../auth/strategies/access.strategy';
import { Jwt } from '../../common/decorators/jwt.decorator';
import { Roles } from '../../common/decorators/role.decorator';
import { filterDtoByRole } from '../../common/helpers/filter_dto.helper';

@Controller('accounts')
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@Get(':id')
	async findUnique(@Param('id') id: number, @Jwt() user: JwtData) {
		return await this.accountService.findUnique({ account_id: id }, user);
	}

	@Get()
	async findMany(@Query() dto: GetAccountDto, @Jwt() user: JwtData) {
		return await this.accountService.findMany(dto, user);
	}

	@Roles('ADMIN', 'EMPLOYEE')
	@Post()
	async create(@Body() dto: PostAccountDto) {
		return await this.accountService.create(dto);
	}

	@Roles('ADMIN', 'EMPLOYEE')
	@Post(':id')
	async addUser(@Param('id') id: number, @Body() dto: AddAccountDto) {
		return await this.accountService.addUser(id, dto);
	}

	@Patch(':id')
	async patch(@Param('id') id: number, @Body() dto: PatchAccountDto, @Jwt() user: JwtData) {
		const safeDto = filterDtoByRole(dto, PatchAccountDtoPolicy[user.role]) as PatchAccountDto;

		return await this.accountService.patch(id, safeDto, user);
	}
}
