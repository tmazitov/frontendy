class Timer {
    private interval: NodeJS.Timeout | undefined = undefined;
    private counter: number = 0
    
    private isCounting: boolean = false;
    
    start(omChange: (counter: number) => void) {
        if (this.isCounting) {
            return;
        }
        
        this.isCounting = true;
        this.counter = 0;
        this.interval = setInterval(() => {
            this.counter++;
            omChange(this.counter);
        }, 1000);
    }

    stop() {
        if (!this.isCounting) {
            return;
        }
        
        this.isCounting = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }

    reset() {
        this.counter = 0;
    }
}

class TimerStorage {
    private static timers: Map<string, Timer> = new Map();

    static addTimer(name: string, onChange: (counter: number) => void) {
        if (this.timers.has(name)) {
            return;
        }
        
        const timer = new Timer();
        this.timers.set(name, timer);
        timer.start(onChange);
        return timer;
    }

    static removeTimer(name: string) {
        const timer = this.timers.get(name);
        if (timer) {
            timer.stop();
            this.timers.delete(name);
        }
    }

    static closeAll() {
        this.timers.forEach((timer) => {
            timer.stop();
        });
        this.timers.clear();
    }
}

export default TimerStorage;