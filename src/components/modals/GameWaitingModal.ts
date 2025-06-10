import LoadingLayout from "../../layouts/loading/LoadingLayout";
import ModalLayout from "../../layouts/modal/ModalLayout";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";
import TimerStorage from "../../pkg/timer";
import InfoParagraphComponent from "../inputs/InfoParagraphComponent";

function pair(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
}


export default class GameWaitingModal extends FrontendyComponent {
    componentName: string = 'game-waiting-modal';

    constructor(initialTimer: number | undefined = 30) {
        super({initialTimer});
    }

    data() {
        return {
            show: false,
            timer: this.props.initialTimer,
        }
    }

    setShow(show: boolean) {
        this.state.show = show;
        if (this.state.timer && this.state.show && !TimerStorage.checkTimer('game-waiting-modal')) {
            TimerStorage.addTimer('game-waiting-modal', (counter: number) => {
                if (this.state.timer <= 0) {
                    this.setShow(false);
                    TimerStorage.removeTimer('game-waiting-modal');
                    return;
                }
                this.state.timer = this.props.initialTimer - counter;
            })
        }
        return this;
    }

    template() {

        // Header
        const header = elem("h2")
        .setProps({ class: "text-lg font-semibold text-gray-800" })
        .addChild(`Game ready to start`);

        // Body
        const body = elem("div")
            .setProps({ class: "flex flex-col gap-4" })
            .setChild([
                new LoadingLayout({
                    label: "Please wait...", 
                    icon: "ti ti-loader",
                    withoutShadow: true,
                }).setShow(this.state.isLoading),
                
                new InfoParagraphComponent(`0:${pair(this.state.timer)}.`),
                new InfoParagraphComponent(`Waiting for your opponent connection.`),
            ])

        return elem('span').addChild(
            new ModalLayout("game-launch-modal", {
                customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white",
            })
            .setShow(this.state.show)
            .setSlot("body", body)
            .setSlot("header", header)
        )
    }
}