import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as hbsUtils from 'hbs-utils';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views/layouts')); // 'registerPartials' method tells hbs that the what folder will be used for storing handlebars Partials
  hbsUtils(hbs).registerWatchedPartials(join(__dirname, '..', 'views/layouts')); // 'registerWatchedPartials' method tells hbsUtils that the what foler will be watched for changing handlebars Partials
  app.setViewEngine('hbs');

  app.use(
    session({
      secret: 'nest-book',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(function (req, res, next) {
    res.locals.session = req.session;
    const flashErrors: string[] = req.session.flashErrors;
    if (flashErrors) {
      res.locals.flashErrors = flashErrors; // if there are 'flashErrors', extends the 'res.locals' to contain the 'flashErrors'
      req.session.flashErrors = null; // destory the req.session.flashErrors content
    }
    next();
  });

  app.use('/admin*', function (req, res, next) {
    // middleware for routes that begins with the '/admin'
    if (req.session.user && req.session.user.role == 'admin') {
      // if the current user is logged in as an admin, can access the current '/admin' route
      next();
    } else {
      // if the current user is logged in as a client, be redirected to the home page
      res.redirect('/');
    }
  });

  app.use('/account*', function (req, res, next) {
    // the middleware that applies for routes that begins with the '/account'
    if (req.session.user) {
      // if current user is logged in
      next();
    } else {
      res.redirect('/');
    }
  });

  await app.listen(3000);
}
bootstrap();
