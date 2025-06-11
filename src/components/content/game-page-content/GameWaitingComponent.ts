import LoadingLayout from "../../../layouts/loading/LoadingLayout";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import TimerStorage from "../../../pkg/timer";
import InfoParagraphComponent from "../../inputs/InfoParagraphComponent";

function pair(num: number) {
    return num < 10 ? `0${num}` : `${num}`;
}

export default class GameWaitingComponent extends FrontendyComponent {
    componentName: string = 'game-waiting-component';

    constructor(timeLeft: number) {
        super();

        if (TimerStorage.checkTimer("game-waiting")) {
            TimerStorage.removeTimer("game-waiting");
        }
        if (timeLeft <= 0) {
            return ;
        }
        TimerStorage.addTimer("game-waiting", (counter: number) => {
            if (timeLeft - counter <= 0) {
                TimerStorage.removeTimer("game-waiting");
                return ;
            }
            this.state.timeLeft = timeLeft - counter;
        })
    }

    protected data(): {} {
        return {
            timeLeft: 0,
        }
    }

    template() {
        return elem('div')
            .setProps({class: 'p-[16px] w-[512px] h-[320px] relative flex flex-col items-center gap-4 align-center'})
            .setChild([

                elem("i")
                .setProps({class: `${this.props.icon} text-2xl text-blue-500 animate-spin`}),

                // Header
                elem("h2")
                .setProps({ class: "text-lg font-semibold text-gray-800" })
                .addChild(`Game ready to start`),
                

                // Body
                elem("div")
                .setProps({ class: "flex flex-col gap-4" })
                .setChild([
                    new InfoParagraphComponent(`0:${pair(this.state.timeLeft)}`),
                    new InfoParagraphComponent(`Waiting for your opponent connection.`),
                ]),
            ])
    }
}