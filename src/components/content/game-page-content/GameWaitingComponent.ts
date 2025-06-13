import LoadingLayout from "../../../layouts/loading/LoadingLayout";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import TimerStorage from "../../../pkg/timer";
import InfoParagraphComponent from "../../inputs/InfoParagraphComponent";
import GameOverTitleComponent from "./GameOverTitleComponent";

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
            if (timeLeft - counter < 0) {
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
            .setProps({class: 'p-[16px] w-[512px] relative flex flex-col items-center align-center'})
            .setChild([
                
                elem("i")
                .setProps({class: `ti ti-player-pause text-2xl text-blue-500 md-2`}),
                
                new InfoParagraphComponent(`0:${pair(this.state.timeLeft)}`, {isTextCentered: true}),


                new GameOverTitleComponent('Game Paused'),

                new InfoParagraphComponent(`Waiting for your opponent connection.`),
            ])
    }
}