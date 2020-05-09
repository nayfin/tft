import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class ProxyService {
  constructor(private http: HttpService) {}

  proxyGet(url: string) {
    return this.http.get(url);
  }
}
