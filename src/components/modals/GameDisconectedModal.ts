import { time } from "console";
import LoadingLayout from "../../layouts/loading/LoadingLayout";
import ModalLayout from "../../layouts/modal/ModalLayout";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import TimerStorage from "../../pkg/timer";
import InfoParagraphComponent from "../inputs/InfoParagraphComponent";

function pair(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
}

export default class GameDisconnectedModal extends FrontendyComponent {
    componentName: string = 'game-disconnected-modal';
    
    constructor(nickname: string | undefined) {
        super({ nickname })
    }

    data() {
        return {
            show: false,
            isLoading: false,
            timer: 30,
        }
    }

    public setShow(value: boolean) {
        this.state.show = value;
        if (this.state.show) {
            TimerStorage.addTimer("game-disconected-modal", (counter: number) => {
                if (this.state.timer == 0) {
                    this.setShow(false);
                    TimerStorage.removeTimer("game-disconected-modal");
                    return;
                }
                this.state.timer = 30 - counter;
            })
        }
        return this 
    }

    public onMounted(): void {

    }

    template() {

        // Header
        const header = elem("h2")
        .setProps({ class: "text-lg font-semibold text-gray-800" })
        .addChild(`"${this.props.nickname}" disconected`);

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
                new InfoParagraphComponent(`Please wait your opponent "${this.props.nickname}" to reconnect.`),
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