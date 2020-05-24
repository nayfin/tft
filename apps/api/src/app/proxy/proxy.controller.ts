import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ProxyService } from './proxy.service';

@Controller('proxy')
export class ProxyController {

  constructor(
    private readonly proxyService: ProxyService
  ) {

  }
  // TODO: This doesn't work at all.
  // need to encode decode url query param as to not interfere with base query params
  // I don't need it for now but it would make a nice library
  // one probably already exists
  @Get('')
  proxyGet(
    @Query() query: {url: string},
    @Res() response
    ) {
    // console.log('proxy', query)
    return this.proxyService.proxyGet(query.url).subscribe((res) => {
      // console.log(res)
      response.send(res.data);
    });
  }
}
