import { GetUserDto } from './dto/get.dto';
import { UserService } from './users.service';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { Roles } from '@/common/decorators/role.decorator';
import { JwtData } from '../auth/strategies/access.strategy';
import { PostUserDto, PostUserRolesDto } from './dto/post.dto';
import { PatchUserDto, PatchUserRolesDto } from './dto/update';
import { filterDtoByRole } from '@/common/helpers/filter_dto.helper';
import { Body, Controller, Get, Param, Query, Post, Patch } from '@nestjs/common';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':id')
	async findUnique(@Param('id') id: number, @Jwt() user: JwtData) {
		return await this.userService.findUnique({ user_id: id }, user);
	}

	@Roles('ADMIN', 'EMPLOYEE')
	@Get()
	async findMany(@Query() dto: GetUserDto) {
		return await this.userService.findMany(dto);
	}

	@Roles('ADMIN', 'EMPLOYEE')
	@Post()
	async create(@Body() dto: PostUserDto, @Jwt('role') role: string) {
		const safeDto = filterDtoByRole(dto, PostUserRolesDto, role);

		return await this.userService.create(safeDto);
	}

	@Patch(':id')
	async update(@Param('id') id: number, @Body() dto: PatchUserDto, @Jwt() user: JwtData) {
		const safeDto = filterDtoByRole(dto, PatchUserRolesDto, user.role);

		return await this.userService.patch(id, safeDto, user);
	}
}
