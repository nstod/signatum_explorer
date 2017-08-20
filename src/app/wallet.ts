export class Wallet {
    constructor(address: string) {
        this.Address = address;
    }
    public Address: string;
    public Balance: number;
}