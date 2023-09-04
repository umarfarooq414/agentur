import { ConfigEnum, ISocialConfig } from '@lib/types';
import { registerAs } from '@nestjs/config';

export default registerAs(
  ConfigEnum.SOCIAL,
  (): ISocialConfig => ({
    GOOGLE_APP_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_APP_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FACEBOOK_APP_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  }),
);
