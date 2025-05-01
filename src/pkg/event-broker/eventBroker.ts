export default class EventBroker {
    static instance: EventBroker;
    private listeners: Map<string, Function>;

    constructor() {
        this.listeners = new Map();
    }

    static getInstance(): EventBroker {
        if (!EventBroker.instance) {
            EventBroker.instance = new EventBroker();
        }
        return EventBroker.instance;
    }

    on(event: string, callback: Function): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, callback);
        }
    }

    off(event: string): void {
        if (this.listeners.has(event)) {
            this.listeners.delete(event);
        }
    }

    emit(event: string, ...args: any[]): void {
        if (this.listeners.has(event)) {
            const callback = this.listeners.get(event);
            if (callback) {
                callback(...args);
            }
        } else {
            console.warn(`EventBroker warn : no listener for event: ${event}`);
        }
    }
}