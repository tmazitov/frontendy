export default class Message<T> {
    private type: T;
    private raw: string;
    private data: any;

    constructor(raw:string) {
        console.log("Message info: Message constructor", raw);
        const obj = JSON.parse(raw);
        this.type = obj.type;
        
        this.raw = raw;
        this.data = obj;
    }

    public getType(): T {
        return this.type;
    }

    public getData(): any {
        return this.data;
    }
}