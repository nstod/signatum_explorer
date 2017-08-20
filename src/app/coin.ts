export class Coin {
    constructor(value: number, low: number, high: number) {
        this.Value = value;
        this.Low = low;
        this.High = high;
    }
    public Value: number;
    public Low: number;
    public High: number;
}