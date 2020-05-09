import { Controller, Get, Param, Redirect, All } from '@nestjs/common';

import { Message } from '@tft/api-interfaces';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
    ) {}

  @Get('hello')
  getData(): Message {
    return this.appService.getData();
  }
}
