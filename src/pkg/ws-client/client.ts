import Message from "./message";

type WebSocketClientOptions = {
    onOpenCallback?: () => void;
    onCloseCallback?: () => void;
    onErrorCallback?: (error: Event) => void;
}

export default class WebSocketClient<T> {
    private socket: WebSocket;
    private listeners: Map<T, (data: any) => void>;
    private opts?: WebSocketClientOptions;

    constructor(addr: string, opts?: WebSocketClientOptions) {
        this.listeners = new Map<T, (data: any) => void>();
        this.socket = new WebSocket(addr);
        this.opts = opts;

        this.socket.onopen = this.openHandler.bind(this);
        this.socket.onclose = this.closeHandler.bind(this);
        this.socket.onerror = this.errorHandler.bind(this);
        this.socket.onmessage = this.messageHandler.bind(this);
    }

    public close() {
        this.socket.close();
    }

    public on(type: T, callback: (data: string | undefined) => void): WebSocketClient<T> {
        if (this.listeners.has(type)) {
            console.warn(`WebSocketClient warning : Listener for ${type} already exists, overwriting...`);
        }
        this.listeners.set(type, callback);
        return this;
    }

    public send(type: string, data?: Record<string, any> ) {
        this.socket.send(JSON.stringify({ type, ...data }));
    }

    private openHandler() {
        console.log("WebSocketClient info: WebSocket WebSocketClient opened");
        if (this.opts?.onOpenCallback) {
            this.opts.onOpenCallback();
        }
    }
    
    private closeHandler() {
        console.log("WebSocketClient info : WebSocket WebSocketClient closed");
        if (this.opts?.onCloseCallback) {
            this.opts.onCloseCallback();
        }
    }

    private errorHandler(error: Event) {
        console.error("WebSocketClient error : WebSocket error", error);
        if (this.opts?.onErrorCallback) {
            this.opts.onErrorCallback(error);
        }
    }

    private messageHandler(event: MessageEvent) {
        const raw = event.data;
        let message: Message<T>;
        try {
            message = new Message<T>(raw);
        } catch (e) {
            console.error("WebSocketClient error : WebSocket message parse error", e);
            return;
        }

        const messageListener = this.parseMessage(message);
        if (!messageListener) {
            console.warn(`WebSocketClient error : WebSocket message ${message.getType()} listener not found`);
            return;
        }   
        
        const data = message.getData();
        messageListener(data);
        console.log(`WebSocketClient info : ${message.getType()}\t|`, data);
    }
 
    private parseMessage(message: Message<T>): ( (data: any) => void ) | undefined{
        const type:T = message.getType();
        return this.listeners.get(type);
    }
}
