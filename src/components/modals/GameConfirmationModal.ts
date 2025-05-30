import LoadingLayout from "../../layouts/loading/LoadingLayout";
import ModalLayout from "../../layouts/modal/ModalLayout";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import GameLauncher from "../../pkg/game/launcher/gameLauncher";
import TimerStorage from "../../pkg/timer";
import Game from "../../types/Game";
import GameConfirmationComponent from "../content/game-confirmation-modal-content/GameConfirmationComponent";
import GameWaitComponent from "../content/game-confirmation-modal-content/GameWaitComponent";

export default class GameConfirmationModal extends FrontendyComponent {
    componentName: string = 'game-launch-modal';

    constructor(game: Game, time?: number) {
        super({ game, time })
    }

    data() {
        return {
            show: false,
            isLoading: false,
            isConfirmed: false,
            delay: this.props.time ? this.props.time : 20,
        }
    }

    public setShow(value: boolean) {
        this.state.show = value;
        if (value) {
            TimerStorage.addTimer("game-confirmation-modal", (counter: number) => {
                if (this.state.delay == 0) {
                    TimerStorage.removeTimer("game-confirmation-modal");
                    this.state.isLoading = false;
                    this.state.isConfirmed = false;
                    this.state.show = false;
                    return;
                }
                this.state.delay = (this.props.time || 20) - counter;
            })
        }
        return this 
    }

    private onSubmit() {
        this.state.isLoading = true;
        GameLauncher.confirmGame(() => {
            console.log("successfully confirmed game");
            this.state.isLoading = false;
            this.state.isConfirmed = true;
        })
    }

    private time(num:number){
        const seconds = num < 10 ? "0" + num : num
        return "0:" + seconds;
    }

    template() {

        const modal = new ModalLayout("game-launch-modal", {
            customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white"
        }).setShow(this.state.show)

        // Header

        const headerText = this.state.isConfirmed ?
            "Waiting for all confirmations..." :
            "Found a game!";
        const header = elem("h2")
        .setProps({ class: "text-lg font-semibold text-gray-800" })
        .addChild(text(headerText))
        modal.setSlot("header", header);

        // Body
        const remainingTime = this.time(this.state.delay);
        if (this.state.isConfirmed) {
            const body = elem("span")
            .setChild([
                new GameWaitComponent(remainingTime)
            ])
            modal.setSlot("body", body)
        } else {

            const body = elem("span")
            .setChild([
                new LoadingLayout({
                    label: "Please wait...", 
                    icon: "ti ti-loader"
                }).setShow(this.state.isLoading),
                new GameConfirmationComponent(remainingTime, this.onSubmit.bind(this)),
            ])
            modal.setSlot("body", body)
        }

        return elem('span').addChild(modal)
    }
}