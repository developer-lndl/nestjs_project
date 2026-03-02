import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const newPost = await this.postsRepository.save(createPostDto);
      return newPost;
    } catch (error) {
      throw new BadRequestException('Failed to create post');
    }
  }

  async findAll() {
    const posts = await this.postsRepository.find();
    return posts;
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      const postToUpdate = await this.findOne(id);
      const updated = this.postsRepository.merge(postToUpdate, updatePostDto);
      const saved = await this.postsRepository.save(updated);
      return saved;
    } catch (error) {
      throw new BadRequestException('Failed to update post');
    }
  }

  async remove(id: number) {
    try {
      await this.postsRepository.delete(id);
      return { message: `Post with id ${id} deleted successfully` };
    } catch (error) {
      throw new BadRequestException('Failed to delete post');
    }
  }
}
