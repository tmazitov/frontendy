export default class StoreField<T> {
    private value: T | undefined;
    private isSet: boolean = false;
    private pendingResolversQueue: Array<(value:T) => void> = [];

    public setValue(newValue: T): void {
        this.value = newValue;
        this.isSet = true;
        this.pendingResolversQueue.forEach(resolve => resolve(newValue))
        this.pendingResolversQueue = [];
    }

    public getValue(): Promise<T | undefined> {
        if (this.isSet) {
            return new Promise((resolve, reject) => {
                resolve(this.value);
            })
        }
        return new Promise((resolve) => {
            // this.pendingResolversQueue.push((value:T|null) => resolve(value))
            this.pendingResolversQueue.push(resolve)
        })
    }

    public clearValue(): void {
        this.value = undefined;
        this.isSet = false;
    }    
}