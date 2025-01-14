import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    try {
      const hashedPassword = await this.hashingService.hash(password);
      const newUser = this.userRepository.create({
        email,
        password: hashedPassword,
      });

      return this.userRepository.save(newUser);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Falha ao cadastrar usuario!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ email });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }
}
