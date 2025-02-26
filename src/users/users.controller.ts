import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, Role } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { currentUser } from '../auth/decorators/currentUser.decorator';
import { User } from './entities/user.entity';
import { JwtAuthGaurd } from '../auth/guards/jwtAuth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }

  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGaurd)
  @Get()
  findAll(@currentUser() user: User) {
    console.log('user in findall: ' + user.email);

    return this.usersService.findAll();
  }
  @UseGuards(JwtAuthGaurd)
  @Get('profile')
  findOne(@currentUser() user: User) {
    return this.usersService.findOne(user);
  }

  @UseGuards(JwtAuthGaurd)
  @Patch('')
  update(@Body() updateUserDto: UpdateUserDto, @currentUser() user: User) {
    return this.usersService.update(updateUserDto, user);
  }

  @UseGuards(JwtAuthGaurd)
  @Delete('')
  remove(@currentUser() user: User) {
    return this.usersService.remove(user);
  }
}
