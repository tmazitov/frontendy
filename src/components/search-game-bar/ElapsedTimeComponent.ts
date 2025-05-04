import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";

let interval: NodeJS.Timeout | undefined = undefined;

export default class ElapsedTimeComponent extends FrontendyComponent {
    componentName: string = 'elapsed-time-component';


    data() {
        return {
            startedAt: new Date(),
            elapsedTime: "0:00",
            isCounting: false,
        }
    }

    updateTime() {
        const elapsedSeconds = Math.floor((new Date().getTime() - this.state.startedAt.getTime()) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        this.state.elapsedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    setCounting(isCounting: boolean) {

        if (this.state.isCounting == isCounting) {
            return this;
        }

        if (interval) {
            clearInterval(interval);
            interval = undefined;
        }

        this.state.isCounting = isCounting;
        if (this.state.isCounting) {
            this.state.startedAt = new Date();
            interval = setInterval(this.updateTime.bind(this), 1000);
        }
        return this;
    }

    onUnmounted(): void {
        clearInterval(interval);
        interval = undefined;
    }

    template() {
        return elem('p')
            .setChild([
                text(this.state.elapsedTime)
            ])
    }
}