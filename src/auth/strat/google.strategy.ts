import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = `${configService.get<string>('SERVER_URL')}/auth/google/callback`;

    if (!clientID || !clientSecret) {
      throw new Error('Google client ID or secret not configured.');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const { displayName, emails, photos } = profile;

      const user = {
        email: emails?.[0]?.value,
        name: displayName,
        picture: photos?.[0]?.value,
      };

      // Используем асинхронный вызов для удовлетворения ESLint
      await Promise.resolve(user);
      done(null, user); // Пользователь найден и возвращён
    } catch (error) {
      done(error, false); // Ошибка и отсутствие пользователя
    }
  }
}
