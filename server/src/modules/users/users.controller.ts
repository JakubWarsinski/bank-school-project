import { GetUserDto } from './dto/get.dto';
import { UserService } from './users.service';
import { JwtData } from '../auth/strategies/access.strategy';
import { PostUserDto, PostUserDtoPolicy } from './dto/post.dto';
import { PatchUserDto, PatchUserDtoPolicy } from './dto/patch';
import { Body, Controller, Get, Param, Query, Post, Patch } from '@nestjs/common';
import { Jwt } from '../../common/decorators/jwt.decorator';
import { Roles } from '../../common/decorators/role.decorator';
import { filterDtoByRole } from '../../common/helpers/filter_dto.helper';
import { PolicyBody } from '../../common/decorators/policy.decorator';

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
	async create(
		@PolicyBody(PostUserDtoPolicy)
		dto: PostUserDto,
	) {
		return await this.userService.create(dto);
	}

	@Patch(':id')
	async update(@Param('id') id: number, @Body() dto: PatchUserDto, @Jwt() user: JwtData) {
		const safeDto = filterDtoByRole(dto, PatchUserDtoPolicy[user.role]) as PatchUserDto;

		return await this.userService.patch(id, safeDto, user);
	}
}
