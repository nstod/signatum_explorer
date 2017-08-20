import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Coin } from './coin';
import 'rxjs/add/operator/map';

@Injectable()
export class CryptopiaService {
  constructor (
    private http: Http
  ) {}

  getMarketPrice(market1: string, market2: string) {
    return this.http.get(`https://www.cryptopia.co.nz/api/GetMarket/` + market1 + `_` + market2)
    .map((res:Response) => {
      let json = res.json();
      return new Coin(parseFloat(json.Data.LastPrice), parseFloat(json.Data.Low), parseFloat(json.Data.High));
    });
  }
}