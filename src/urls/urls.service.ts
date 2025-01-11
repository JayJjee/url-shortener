import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from '../entities/url.entity';
import { customAlphabet } from 'nanoid';

@Injectable()
export class UrlsService {
  private readonly nanoid = customAlphabet(
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    8,
  );

  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  // Criar uma URL curta
  async createShortUrl(originalUrl: string, userId?: number): Promise<Url> {
    const shortUrl = this.nanoid();

    const newUrl = this.urlRepository.create({
      originalUrl,
      shortUrl,
      user: userId ? { id: userId } : null,
    });

    return await this.urlRepository.save(newUrl);
  }

  async findByShortUrl(shortUrl: string): Promise<Url | null> {
    return await this.urlRepository.findOne({
      where: { shortUrl },
    });
  }

  async incrementClicks(shortUrl: string): Promise<Url> {
    const url = await this.findByShortUrl(shortUrl);

    if (!url) {
      throw new Error('URL não encontrada');
    }

    url.clicks += 1;

    return await this.urlRepository.save(url);
  }
}
