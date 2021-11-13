import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import prisma from "../../db/prisma";
import bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

type RegisterDto = {
  username: string;
  password: string;
  email: string;
  character: string;
  steamUrl: string;
  confirmPassword: string;
};

type RegisterDto2 = {
  username: string;
  password: string;
  email: string;
  character: string;
  steamUrl: string;
};

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async isCredentialsCorrect(credentials: LoginDto): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        username: credentials.username,
      },
      select: {
        username: true,
        password: true,
      },
    });
    if (!user) {
      return false;
    }
    return bcrypt.compare(credentials.password, user.password);
  }

  async login(credentials: LoginDto) {
    return {
      token: this.jwtService.sign({ username: credentials.username }),
    };
  }

  async register(credentials: RegisterDto): Promise<void> {
    const [usernameCount, emailCount] = await Promise.all([
      prisma.user.count({ where: { username: credentials.username } }),
      prisma.user.count({ where: { email: credentials.email } }),
    ]);
    if (usernameCount) {
      throw new HttpException(
        "USERNAME_ALREADY_REGISTERED",
        HttpStatus.BAD_GATEWAY,
      );
    }
    if (emailCount) {
      throw new HttpException(
        "EMAIL_ALREADY_REGISTERED",
        HttpStatus.BAD_GATEWAY,
      );
    }
    const salt = await bcrypt.genSalt(10);
    await prisma.user.create({
      data: {
        username: credentials.username,
        password: await bcrypt.hash(credentials.password, salt),
        steamUrl: credentials.steamUrl,
        character: credentials.character,
        email: credentials.email,
      },
    });
  }
}
