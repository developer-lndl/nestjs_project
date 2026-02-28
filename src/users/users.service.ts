import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
    },
  ];

  findAll() {
    return this.users;
  }
  getUserById(id: string) {
    const position = this.findOne(id);
    const user = this.users[position];
    if (user.id === '1') {
      throw new ForbiddenException('Access to this user is forbidden');
    }
    return user;
  }
  create(body: CreateUserDto) {
    const newUser = {
      ...body,
      id: `${new Date().getTime()}`,
    };
    this.users.push(newUser);
    return newUser;
  }
  update(id: string, user: UpdateUserDto) {
    const position = this.findOne(id);
    const currentData = this.users[position];
    const updatedUser = {
      ...currentData,
      ...user,
    };
    this.users[position] = updatedUser;
    return updatedUser;
  }
  delete(id: string) {
    const position = this.findOne(id);
    this.users.splice(position, 1);
    return {
      message: 'User deleted successfully',
    };
  }
  private findOne(id: string) {
    const position = this.users.findIndex((user) => user.id === id);
    if (position === -1) {
      throw new NotFoundException('User not found');
    }
    return position;
  }
}
