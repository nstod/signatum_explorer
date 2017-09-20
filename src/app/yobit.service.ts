import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Coin } from './coin';
import 'rxjs/add/operator/map';

@Injectable()
export class YobitService {
  constructor (
    private http: Http
  ) {}

  getMarketPrice(market1: string, market2: string) {
    return this.http.get(`http://signatum-cors.azurewebsites.net/yobit.net/api/2/` + market1 + `_` + market2 + '/ticker')
    .map((res:Response) => {
      let json = res.json();
      return new Coin(json.ticker.last, json.ticker.low, json.ticker.high);
    });
  }
}