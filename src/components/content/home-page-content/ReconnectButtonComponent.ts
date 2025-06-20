import router from "../../../pages/router";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import ButtonComponent from "../../inputs/ButtonComponent";

export default class ReconnectButtonComponent extends FrontendyComponent {
    componentName: string = 'reconnect-button-component';

    onReconnect() {
        router.push('game')
    }

    template() {
        return elem('span')
            .setChild([
                new ButtonComponent({
                    label: 'Reconnect',
                    color: "blue",
                    icon: "ti ti-refresh",

                }).onClick(() => this.onReconnect()),
            ])
    }
}