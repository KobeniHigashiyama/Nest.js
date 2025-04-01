import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service';
import { AuthDto } from './dto/auth_dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  id: string;
}

interface OAuthRequest {
  user: {
    email: string;
    name: string;
    picture?: string;
  };
}

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refresh_token';

  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = this.issueToken(user.id);
    return { user, ...tokens };
  }

  async register(dto: AuthDto) {
    const existingUser = await this.userService.getByEmail(dto.email);
    if (existingUser) throw new BadRequestException('Already registered');

    const user = await this.userService.create(dto);
    const tokens = this.issueToken(user.id);
    return { user, ...tokens };
  }

  async getNewTokens(refreshToken: string) {
    try {
      const result = await this.jwt.verifyAsync<JwtPayload>(refreshToken);
      if (!result || !result.id) {
        throw new UnauthorizedException('Invalid Token');
      }
      const user = await this.userService.getById(result.id);
      if (!user) throw new UnauthorizedException('User not found');
      const tokens = this.issueToken(user.id);
      return { user, ...tokens };
    } catch (error: unknown) {
      console.error('Error during token validation:', (error as Error).message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  issueToken(userId: string) {
    const payload = { id: userId };
    const accessToken = this.jwt.sign(payload, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async validateOAuthLogin(req: OAuthRequest) {
    let user = await this.userService.getByEmail(req.user.email);
    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          email: req.user.email,
          name: req.user.name,
          picture: req.user.picture,
        },
        include: {
          stores: true,
          favorites: true,
          orders: true,
        },
      });
    }
    const tokens = this.issueToken(user.id);
    return { user, ...tokens };
  }

  addRefreshToken(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);
    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.get<string>('SERVER_DOMAIN'),
      expires: expiresIn,
      secure: true,
      sameSite: 'none',
    });
  }

  removeRefreshToken(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this.configService.get<string>('SERVER_DOMAIN'),
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    });
  }
}
