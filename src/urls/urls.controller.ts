import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from '../dto/create-url.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  async create(@Body() createUrlDto: CreateUrlDto) {
    const user = createUrlDto.userId ? createUrlDto.userId : null;

    return await this.urlsService.createShortUrl(
      createUrlDto.originalUrl,
      user,
    );
  }

  @Get(':shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    const url = await this.urlsService.findByShortUrl(shortUrl);

    if (!url) {
      throw new HttpException('URL não encontrada', HttpStatus.NOT_FOUND);
    }

    await this.urlsService.incrementClicks(shortUrl); // Conta o clique
    res.redirect(url.originalUrl);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async list(@Param('userId') userId: number) {
    return await this.urlsService.listUrlsByUser(userId);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(
    @Body('originalUrl') originalUrl: string,
    @Body() createUrlDto: CreateUrlDto,
  ) {
    const user = createUrlDto.userId;
    return await this.urlsService.updateUrl(originalUrl, user);
  }

  @Delete(':shortUrl')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('shortUrl') shortUrl: string,
    @Body() createUrlDto: CreateUrlDto,
  ) {
    const user = createUrlDto.userId;
    return await this.urlsService.deleteUrl(shortUrl, user);
  }
}
