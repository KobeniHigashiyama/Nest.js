/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// .eslintrc.js
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
  Res,
  Req,
  UnauthorizedException,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth_dto';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import * as process from 'node:process';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.login(dto);
    this.authService.addRefreshToken(res, refreshToken);
    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.register(dto); // Регистрируем пользователя
    const { refreshToken, ...response } = await this.authService.login(dto); // Логиним после регистрации
    this.authService.addRefreshToken(res, refreshToken); // Добавляем refresh токен в куки
    return response; // Возвращаем ответ
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/access-token')
  async getNewToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookies =
      req.cookies?.[this.authService.REFRESH_TOKEN_NAME];
    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshToken(res);
      throw new UnauthorizedException('Refresh token not found');
    }

    // Получаем новые токены
    const { refreshToken, ...response } = await this.authService.getNewTokens(
      refreshTokenFromCookies,
    );
    this.authService.addRefreshToken(res, refreshToken); // Добавляем refresh токен в куки
    return response; // Возвращаем ответ
  }
  @HttpCode(200)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshToken(res);
    await Promise.resolve();
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Get('google')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @UseGuards(AuthGuard('google'))
  googleAuth(@Req() _req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req:any,
    @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.validateOAuthLogin(req)
    this.authService.addRefreshToken(res, refreshToken);
    return res.redirect(
      `${process.env['CLIENT_URL']}/dashboard?accessToken=${response.accessToken}`
    );
  }
}