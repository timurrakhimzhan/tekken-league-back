import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Query,
} from "@nestjs/common";
import { JwtGuard } from "../../guards/jwt.guard";
import { RegisterBodyDto } from "../../dtos/register.dto";
import { UserService } from "./user.service";
import { GetProfileResDto } from "../../dtos/get-profile.dto";
import { GetUsersQueryDto, GetUsersResDto } from "../../dtos/get-users.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post("")
  register(@Body() credentials: RegisterBodyDto) {
    return this.userService.register(credentials);
  }

  @Get(":username")
  @UseGuards(JwtGuard)
  async getProfile(
    @Param("username") username: string,
  ): Promise<GetProfileResDto> {
    return this.userService.getProfile(username);
  }

  @Get("")
  async getUsers(@Query() query: GetUsersQueryDto): Promise<GetUsersResDto> {
    return this.userService.getUsers(query);
  }
}
