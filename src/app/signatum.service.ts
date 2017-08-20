import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SignatumService {
  constructor (
    private http: Http
  ) {}

  getBalance(account: string) {
    return this.http.get(`http://explorer.signatum.io/ext/getbalance/` + account)
    .map((res:Response) => parseFloat(res.text()));
  }

}