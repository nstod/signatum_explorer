import { Component, OnInit, OnDestroy } from '@angular/core';
import { CryptopiaService } from './cryptopia.service';
import { SignatumService } from './signatum.service';
import { Wallet } from './wallet';
import { Subscription } from "rxjs";
import { Observable } from "rxjs/Rx";
import { Coin } from './coin';
import { CookieService } from 'ng2-cookies';

@Component({
  selector: 'app-root',
  providers: [CryptopiaService, SignatumService, CookieService],
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
    private cryptopiaService: CryptopiaService,
    private signatumService: SignatumService,
    private cookieService: CookieService) {
    if (this.cookieService.check(this.cookieName)) {
      this.addresses = this.cookieService.get(this.cookieName);
      this.updateWallets();
    }
  }

  ngOnInit() {
    let timer = Observable.timer(0, 10000);
    this.subscription = timer.subscribe(() => this.calculate());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  calculate() {
    this.cryptopiaService.getMarketPrice('SIGT', 'BTC').subscribe(data => { this.sigt = data; this.updateValue(); });
    this.cryptopiaService.getMarketPrice('BTC', 'USDT').subscribe(data => { this.btc = data; this.updateValue(); });
    for (let wallet of this.wallets) {
      this.signatumService.getBalance(wallet.Address).subscribe(data => { wallet.Balance = data; this.updateValue(); });
    }
  }

  setAddresses(input: string) {
    this.addresses = input;
    this.cookieService.set(this.cookieName, this.addresses);
    this.updateWallets();
  }

  updateWallets() {
    this.wallets = [];
    if (!this.addresses) {
      return;
    }

    for (let address of this.addresses.split(',')) {
      this.wallets.push(new Wallet(address));
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
  }
}
