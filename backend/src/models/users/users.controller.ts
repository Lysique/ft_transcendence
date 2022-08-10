import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //  Create a new user
  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    const resp = await this.usersService.create(createUserDto);

    return resp;
  }

  @Get()
  public async findAll() {
    const resp = await this.usersService.findAll();
    
    return resp;
  }
  
  @Get('/:id')
  public async findOne(@Param('id') id: number) {
    const resp = await this.usersService.findOne(id);
  
    return resp;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
