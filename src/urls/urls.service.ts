import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Url } from '../entities/url.entity';
import { PayloadTokenDto } from 'src/dto/payload-token.dto';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  async createShortUrl(originalUrl: string, userId: number | null) {
    const shortUrl = this.generateShortUrl();

    if (userId !== null) {
      const existingUrl = await this.urlRepository.findOne({
        where: { originalUrl, userId, deletedAt: IsNull() },
      });

      if (existingUrl) {
        existingUrl.shortUrl = shortUrl;

        return await this.urlRepository.save(existingUrl);
      }

      const url = this.urlRepository.create({
        originalUrl,
        shortUrl,
        userId,
        clicks: 0,
      });

      return await this.urlRepository.save(url);
    } else {
      const existingUrl = await this.urlRepository.findOneBy({
        originalUrl,
        userId: IsNull(),
        deletedAt: IsNull(),
      });

      if (existingUrl) {
        existingUrl.shortUrl = shortUrl;

        return await this.urlRepository.save(existingUrl);
      }

      const url = this.urlRepository.create({
        originalUrl,
        shortUrl,
        userId,
        clicks: 0,
      });

      return await this.urlRepository.save(url);
    }
  }

  async findByShortUrl(shortUrl: string) {
    return await this.urlRepository.findOne({
      where: { shortUrl, deletedAt: IsNull() },
    });
  }

  async incrementClicks(shortUrl: string) {
    const url = await this.findByShortUrl(shortUrl);
    if (url) {
      url.clicks += 1;
      await this.urlRepository.save(url);
    }
  }

  async listUrlsByUser(tokenPayload: PayloadTokenDto) {
    const result = await this.urlRepository.find({
      where: {
        userId: tokenPayload.sub,
        deletedAt: IsNull(),
      },
      order: {
        clicks: 'DESC',
      },
    });

    if (result.length === 0) {
      throw new HttpException(
        'Usuário não possui links.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (result[0].userId != tokenPayload.sub) {
      throw new HttpException(
        'URL não encontrada ou não pertence ao usuário.',
        HttpStatus.NOT_FOUND,
      );
    }

    console.log('Resultado da busca:', result);
    return result;
  }

  async updateOriginalUrl(
    shortUrl: string,
    updateUrl: string,
    tokenPayload: PayloadTokenDto,
  ) {
    const userId = tokenPayload.sub;

    const findUrl = await this.urlRepository.findOne({
      where: { originalUrl: updateUrl, userId, deletedAt: IsNull() },
    });

    const url = await this.urlRepository.findOne({
      where: { shortUrl, userId, deletedAt: IsNull() },
    });
    console.log(url);

    if (!url) {
      throw new HttpException(
        'URL não encontrada ou não pertence ao usuário.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (findUrl && findUrl.originalUrl === updateUrl) {
      throw new HttpException(
        'URL já existente para usuário. É possível realizar a troca do atalho.',
        HttpStatus.CONFLICT,
      );
    }

    if (url.userId != tokenPayload.sub) {
      throw new HttpException(
        'URL não encontrada ou não pertence ao usuário.',
        HttpStatus.NOT_FOUND,
      );
    }

    url.originalUrl = updateUrl;
    await this.urlRepository.save(url);
  }

  async deleteUrl(shortUrl: string, tokenPayload: PayloadTokenDto) {
    const userId = tokenPayload.sub;
    const url = await this.urlRepository.findOne({
      where: { shortUrl, userId, deletedAt: IsNull() },
    });

    if (!url) {
      throw new HttpException(
        'URL não encontrada ou não pertence ao usuário.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (url.userId != tokenPayload.sub) {
      throw new HttpException(
        'URL não encontrada ou não pertence ao usuário.',
        HttpStatus.NOT_FOUND,
      );
    }

    url.deletedAt = new Date();
    await this.urlRepository.save(url);
  }

  private generateShortUrl() {
    return Math.random().toString(36).substring(2, 8);
  }
}
