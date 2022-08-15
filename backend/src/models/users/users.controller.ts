import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
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
    const resp = await this.usersService.findOneById(id);
  
    return resp;
  }
  
  @Patch(':id')
  public async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const resp = await this.usersService.update(id, updateUserDto);
  
    return resp;
  }

  @Delete(':id')
  @HttpCode(204)
  public async remove(@Param('id') id: string) {
    this.usersService.remove(+id);
  }
}
