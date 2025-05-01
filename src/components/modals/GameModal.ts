import LoadingLayout from "../../layout/loading/LoadingLayout";
import ModalLayout from "../../layout/modal/ModalLayout";
import EventBroker from "../../pkg/event-broker/eventBroker";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import GameLauchBodyComponent from "../content/game-launch-modal-content/BodyComponent";

export default class GameLaunchModal extends FrontendyComponent {
    componentName: string = 'game-launch-modal';

    data() {
        return {
            show: false,
            isLoading: false,
        }
    }

    public setShow(value: boolean) {
        this.state.show = value;
        return this 
    }

    private onSubmit(gameId: number) {
        this.state.isLoading = true;
        setTimeout(() => {
            console.log("Game ID: ", gameId);
            this.state.show = false;
            this.state.isLoading = false;
            EventBroker.getInstance().emit("activate-find-game-bar", gameId);
        }, 2000);
    }

    template() {
        return elem('span')
            .setChild([
                new ModalLayout("game-launch-modal", {
                    onClose: () => this.state.show = false,
                    customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white"
                })
                .setShow(this.state.show)
                .setSlot("header", 
                    elem("h2")
                    .setProps({ class: "text-lg font-bold" })
                    .addChild(text("Game Launch")))
                .setSlot("body", 
                    elem("span")
                    .setChild([
                        new LoadingLayout({
                            label: "Please wait...", 
                            icon: "ti ti-loader"
                        }).setShow(this.state.isLoading),
                        new GameLauchBodyComponent({
                            onSubmit: this.onSubmit.bind(this),
                        }),
                    ])
                )
            ])
    }
}