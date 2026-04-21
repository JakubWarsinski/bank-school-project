import { GetCardDto } from './dto/get.dto';
import { CardService } from './card.service';
import { PostCardDto } from './dto/post.dto';
import { JwtData } from '../auth/strategies/access.strategy';
import { PatchCardDto, PatchCardDtoPolicy } from './dto/patch.dto';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Jwt } from '../../common/decorators/jwt.decorator';
import { Roles } from '../../common/decorators/role.decorator';
import { filterDtoByRole } from '../../common/helpers/filter_dto.helper';

@Controller('cards')
export class CardController {
	constructor(private readonly cardService: CardService) {}

	@Get(':id')
	async findUnique(@Param('id') id: number, @Jwt() user: JwtData) {
		return await this.cardService.findUnique({ card_id: id }, user);
	}

	@Get()
	async findMany(@Query() dto: GetCardDto, @Jwt() user: JwtData) {
		return await this.cardService.findMany(dto, user);
	}

	@Roles('ADMIN', 'EMPLOYEE')
	@Post()
	async create(@Body() dto: PostCardDto) {
		return await this.cardService.create(dto);
	}

	@Patch(':id')
	async patch(@Param('id') id: number, @Body() dto: PatchCardDto, @Jwt() user: JwtData) {
		const safeDto = filterDtoByRole(dto, PatchCardDtoPolicy[user.role]) as PatchCardDto;

		return await this.cardService.patch(id, safeDto, user);
	}
}
