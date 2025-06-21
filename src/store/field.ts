export default class StoreField<T> {
    private value: T | undefined;
    private isSet: boolean = false;
    private pendingResolversQueue: Array<(value:T) => void> = [];
    private onUpdateCallbacks: Array<(value:T|undefined) => void> = [];

    public setValue(newValue: T): void {
        this.value = newValue;
        this.isSet = true;
        this.pendingResolversQueue.forEach(resolve => resolve(newValue))
        this.pendingResolversQueue = [];
        this.onUpdateCallbacks.forEach(callback => callback(newValue));
    }

    public getValue(onUpdate?:(value:T|undefined) => void): Promise<T | undefined> {
        if (onUpdate) {
            this.onUpdateCallbacks.push(onUpdate);
        }
        if (this.isSet) {
            return new Promise((resolve, reject) => {
                if (onUpdate) {
                    onUpdate(this.value);
                }
                resolve(this.value);
            })
        }
        return new Promise((resolve) => {
            this.pendingResolversQueue.push(resolve)
        })
    }

    public clearValue(): void {
        this.value = undefined;
        this.isSet = false;
        this.onUpdateCallbacks.forEach(callback => callback(undefined));
    }    
}