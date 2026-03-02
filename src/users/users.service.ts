import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos/users.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.usersRepository.find({ relations: ['profile'] });
    return users;
  }
  async getUserById(id: number) {
    const user = await this.findOne(id);
    if (user.id === 1) {
      throw new ForbiddenException('Access to this user is forbidden');
    }
    return user;
  }
  async getUserProfileById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user.profile;
  }
  async create(body: CreateUserDto) {
    try {
      const newUser = await this.usersRepository.save(body);
      return newUser;
    } catch {
      throw new BadRequestException('Failed to create user');
    }
  }
  async update(id: number, user: UpdateUserDto) {
    try {
      const userToUpdate = await this.findOne(id);
      const updaterUser = this.usersRepository.merge(userToUpdate, user);
      const updatedUser = await this.usersRepository.save(updaterUser);
      return updatedUser;
    } catch (error) {
      throw new BadRequestException('Failed to update user');
    }
  }
  async delete(id: number) {
    try {
      await this.usersRepository.delete(id);
      return { message: `User with id ${id} deleted successfully` };
    } catch (error) {
      throw new BadRequestException('Failed to delete user');
    }
  }
  private async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
