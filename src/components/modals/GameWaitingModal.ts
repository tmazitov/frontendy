import LoadingLayout from "../../layouts/loading/LoadingLayout";
import ModalLayout from "../../layouts/modal/ModalLayout";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";
import Store from "../../store/store";
import ButtonComponent from "../inputs/ButtonComponent";
import InfoParagraphComponent from "../inputs/InfoParagraphComponent";

export default class GameWaitingModal extends FrontendyComponent {
    componentName: string = 'game-waiting-modal';

    data() {
        return {
            show: true,
        }
    }

    protected onCreated(): void {
        Store.getters.gameIsReady((gameIsReady: boolean | undefined) => {
            if (gameIsReady === undefined || !gameIsReady === this.state.show) {
                return ;
            }
            this.state.show = !gameIsReady;
            this.update();
        })
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