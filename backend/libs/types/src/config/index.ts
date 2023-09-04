export * from './swagger';
export * from './server';
export * from './jwt';
export * from './mail';
export * from './social';

export enum ConfigEnum {
  TYPEORM = 'typeorm',
  SERVER = 'server',
  SWAGGER = 'swagger',
  JWT_TOKEN = 'jwtToken',
  MAIL = 'MAIL',
  SOCIAL = 'SOCIAL',
}
