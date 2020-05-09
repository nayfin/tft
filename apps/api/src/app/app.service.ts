import { Injectable } from '@nestjs/common';
import { Message } from '@tft/api-interfaces';

@Injectable()
export class AppService {
  getData(): Message {
    return { message: 'Welcome to api!' };
  }

  getOptions(): Option[] {
    return [
      {
        label: 'Apple',
        value: 'apple'
      },
      {
        label: 'App',
        value: 'app'
      },
      {
        label: 'Ape',
        value: 'ape'
      },
      {
        label: 'Apple',
        value: 'apple'
      },
      {
        label: 'Apple',
        value: 'apple'
      },
    ];
  }
}

export interface Option {
  label: string;
  value: string;
}
