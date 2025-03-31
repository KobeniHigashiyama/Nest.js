import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-yandex';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('YANDEX_CLIENT_ID');
    const clientSecret = configService.get<string>('YANDEX_CLIENT_SECRET');
    const callbackURL = `${configService.get<string>('SERVER_URL')}/auth/yandex/callback`;

    if (!clientID || !clientSecret) {
      throw new Error('Yandex client ID or secret not configured.');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ): Promise<void> {
    try {
      const { username, emails, photos } = profile;

      const user = {
        email: emails?.[0]?.value,
        name: username,
        picture: photos?.[0]?.value,
      };

      // Асинхронный вызов для соответствия линтеру
      await Promise.resolve(user);
      done(null, user); // Успешная аутентификация
    } catch (error) {
      done(error, false); // Ошибка аутентификации
    }
  }
}
