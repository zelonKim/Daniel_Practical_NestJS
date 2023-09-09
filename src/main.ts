import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as hbsUtils from 'hbs-utils';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'src', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'src', 'views/layouts')); // 'registerPartials' method tells hbs that the what foler will be used for storing handlebars Partials
  hbsUtils(hbs).registerWatchedPartials(
    join(__dirname, '..', 'src', 'views/layouts'),
  ); // 'registerWatchedPartials' method tells hbsUtils that the what foler will be watched for changing handlebars Partials
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
