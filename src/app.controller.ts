import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  @Render('index.hbs') // @Render() Defines a template to be rendered by the controller
  index() {}
}
