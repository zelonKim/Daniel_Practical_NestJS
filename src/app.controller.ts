import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  @Render('index.hbs') // @Render() Defines a template to be rendered by the controller
  index() {
    const viewData = [];
    viewData['title'] = 'Home Page - Seongjin Store  ';
    return {
      viewData,
    };
  }

  @Get('/about')
  @Render('about.hbs')
  about() {
    const viewData = [];
    viewData['title'] = 'About us - Seongjin Store';
    viewData['subtitle'] = 'About us';
    viewData['description'] = 'This is an about page';
    viewData['author'] = 'Developed by Seongjin';

    return {
      viewData,
    };
  }
}
