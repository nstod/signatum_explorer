import { Component, OnInit, OnDestroy } from '@angular/core';
import { CryptopiaService } from './cryptopia.service';
import { SignatumService } from './signatum.service';
import { Wallet } from './wallet';
import { Subscription } from "rxjs";
import { Observable } from "rxjs/Rx";

@Component({
  selector: 'app-root',
  providers: [ CryptopiaService, SignatumService ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private cryptopiaService: CryptopiaService,
    private signatumService: SignatumService)  {
      this.wallets = [];
      this.wallets.push(new Wallet('BMcrUorx7HZYYfmzpYkcR1zjAS4gUKwHmp'));
      this.wallets.push(new Wallet('BEX5cYx3UJCYw4ATAxgaRSeyjyvWw2C18H'));
      this.wallets.push(new Wallet('BS33RLFyKxqZFED16UGqCda83H3pPB1WVM'));
    }
  balance = 0;
  sigtPrice = 0;
  btcPrice = 0;
  value = 0;
  json = '';
  subscription: Subscription;
  wallets: Array<Wallet>;

  ngOnInit() {
    let timer = Observable.timer(0, 10000);
    this.subscription = timer.subscribe(() => this.calculate());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  calculate() {
    this.cryptopiaService.getMarketPrice('SIGT', 'BTC').subscribe(data => { this.sigtPrice = data; this.updateValue(); });
    this.cryptopiaService.getMarketPrice('BTC', 'USDT').subscribe(data => { this.btcPrice = data; this.updateValue(); });
    for (let wallet of this.wallets) {
      this.signatumService.getBalance(wallet.Address).subscribe(data => { wallet.Balance = data; this.updateValue(); });
    }
  }

  updateValue() {
    let tempValue = 0;
    for (let wallet of this.wallets) {
      tempValue += wallet.Balance;
    }

    this.balance = tempValue;
    this.value = this.balance * this.sigtPrice * this.btcPrice;
  }
}
