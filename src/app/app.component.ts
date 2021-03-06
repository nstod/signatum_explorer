import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { YobitService } from './yobit.service';
import { SignatumService } from './signatum.service';
import { Wallet } from './wallet';
import { Subscription } from "rxjs";
import { Observable } from "rxjs/Rx";
import { Coin } from './coin';
import { CookieService } from 'ng2-cookies';

@Component({
  selector: 'app-root',
  providers: [YobitService, SignatumService, CookieService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  balance = 0;
  sigt = new Coin(0, 0, 0);
  btc = new Coin(0, 0, 0);
  sigtValue = 0;
  value = 0;
  json = '';
  subscription: Subscription;
  wallets: Array<Wallet>;
  cookies: Object;
  addresses: string;
  readonly cookieName = "sigtaddreses";

  constructor(
    private yobitService: YobitService,
    private signatumService: SignatumService,
    private cookieService: CookieService,
    private titleService: Title) {
    if (this.cookieService.check(this.cookieName)) {
      this.addresses = this.cookieService.get(this.cookieName);
      this.updateWallets();
    }
  }

  ngOnInit() {
    let timer = Observable.timer(0, 30000);
    this.subscription = timer.subscribe(() => this.calculate());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  calculate() {
    this.yobitService.getMarketPrice('sigt', 'btc').subscribe(data => { this.sigt = data; this.updateValue(); });
    this.yobitService.getMarketPrice('btc', 'usd').subscribe(data => { this.btc = data; this.updateValue(); });
    for (let wallet of this.wallets) {
      if (isNaN(Number(wallet.Address))) {
        this.signatumService.getBalance(wallet.Address).subscribe(data => { wallet.Balance = data; this.updateValue(); });
      }
    }
  }

  setAddresses(input: string) {
    this.addresses = input;
    this.cookieService.set(this.cookieName, this.addresses, new Date(2037, 1, 1));
    this.updateWallets();
  }

  updateWallets() {
    this.wallets = [];
    if (!this.addresses) {
      return;
    }

    for (let address of this.addresses.split(',')) {
      let value = parseInt(address);
      if (isNaN(value)) {
        value = 0;
      }

      this.wallets.push(new Wallet(address, value));
    }

    this.calculate();
  }

  updateValue() {
    if (!this.sigt || !this.btc) {
      return;
    }

    let tempValue = 0;
    for (let wallet of this.wallets) {
      tempValue += wallet.Balance;
    }

    this.balance = tempValue;
    this.sigtValue = this.sigt.Value * this.btc.Value;
    this.value = this.balance * this.sigtValue;
    this.titleService.setTitle('Signatum - ' + this.sigt.Value.toFixed(8));
  }
}
