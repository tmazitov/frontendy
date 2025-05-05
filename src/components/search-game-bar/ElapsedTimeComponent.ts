import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import TimerStorage from "../../pkg/timer";

export default class ElapsedTimeComponent extends FrontendyComponent {
    componentName: string = 'elapsed-time-component';


    data() {
        return {
            elapsedTime: "0:00",
        }
    }

    setCounting(isCounting: boolean) {

        if (this.state.isCounting == isCounting) {
            return this;
        }

        if (isCounting) {
            TimerStorage.addTimer("game-search-bar", (counter: number) => {
                const minutes = Math.floor(counter / 60);
                const seconds = counter % 60;
                this.state.elapsedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            })
        }

        return this;
    }

    template() {
        return elem('p')
            .setChild([
                text(this.state.elapsedTime)
            ])
    }
}