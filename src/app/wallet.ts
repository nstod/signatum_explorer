export class Wallet {
    constructor(address: string, balance: number) {
        this.Address = address;
        this.Balance = balance;
    }
    public Address: string;
    public Balance: number;
}