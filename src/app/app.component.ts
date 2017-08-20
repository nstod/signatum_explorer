import { Component, OnInit, OnDestroy } from '@angular/core';
import { CryptopiaService } from './cryptopia.service';
import { SignatumService } from './signatum.service';
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
    private signatumService: SignatumService)
  {}
  balance = 0;
  sigtPrice = 0;
  btcPrice = 0;
  value = 0;
  json = '';
  subscription: Subscription;

  ngOnInit() {
    let timer = Observable.timer(0, 10000);
    this.subscription = timer.subscribe(() => this.calculate());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  calculate() {
    this.balance = 0;
    this.cryptopiaService.getMarketPrice('SIGT', 'BTC').subscribe(data => { this.sigtPrice = data; this.updateValue(); });
    this.cryptopiaService.getMarketPrice('BTC', 'USDT').subscribe(data => { this.btcPrice = data; this.updateValue(); });
    this.signatumService.getBalance('BMcrUorx7HZYYfmzpYkcR1zjAS4gUKwHmp').subscribe(data => { this.balance += data; this.updateValue(); });
    this.signatumService.getBalance('BEX5cYx3UJCYw4ATAxgaRSeyjyvWw2C18H').subscribe(data => { this.balance += data; this.updateValue(); });
    this.signatumService.getBalance('BS33RLFyKxqZFED16UGqCda83H3pPB1WVM').subscribe(data => { this.balance += data; this.updateValue(); });
  }

  updateValue() {
    this.value = this.balance * this.sigtPrice * this.btcPrice;
  }
}
