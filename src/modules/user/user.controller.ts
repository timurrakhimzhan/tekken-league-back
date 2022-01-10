import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Request,
  Query,
  Put,
  Patch,
} from "@nestjs/common";
import { JwtGuard } from "../../guards/jwt.guard";
import { RegisterBodyDto } from "../../dtos/register.dto";
import { UserService } from "./user.service";
import { GetProfileResDto } from "../../dtos/get-profile.dto";
import { GetUsersQueryDto, GetUsersResDto } from "../../dtos/get-users.dto";
import { GetTop10ResDto } from "../../dtos/get-top-10.dto";
import { FastifyUserRequest } from "../../types/fastify-user-request";
import { EditProfileBodyDto } from "../../dtos/edit-profile.dto";
import { ChangePasswordBodyDto } from "../../dtos/change-password.dto";

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

  // @Put("")
  // async editUser() {
  //
  // }

  @Get("top-10")
  async getTop10(): Promise<GetTop10ResDto> {
    return this.userService.getTop10();
  }

  @Put("")
  @UseGuards(JwtGuard)
  async editProfile(
    @Request() req: FastifyUserRequest,
    @Body() info: EditProfileBodyDto,
  ) {
    return this.userService.editProfile(req.user.username, info);
  }

  @Patch("/password")
  @UseGuards(JwtGuard)
  async changePassword(
    @Request() req: FastifyUserRequest,
    @Body() info: ChangePasswordBodyDto,
  ) {
    return this.userService.changePassword(req.user.username, info);
  }
}
