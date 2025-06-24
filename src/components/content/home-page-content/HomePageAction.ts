import { isAuthorized } from "../../../api/client";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import Store from "../../../store/store";
import InfoParagraphComponent from "../../inputs/InfoParagraphComponent";
import PlayButtonComponent from "./PlayButtonComponent";
import ReconnectButtonComponent from "./ReconnectButtonComponent";

export default class HomePageActionComponent extends FrontendyComponent {
    componentName: string = 'home-page-action-component';

    protected data(): {} {
        return {
            isReconnect: false,
        }
    }

    protected onCreated(): void {
        Store.setters.setupReconnect()
        Store.getters.userIsReconnect((isReconnect: boolean | undefined) => this.setIsReconnect(isReconnect))
            .then((isReconnect: boolean | undefined) => this.setIsReconnect(isReconnect))
    }

    private setIsReconnect(isReconnect: boolean | undefined) {
        if (isReconnect === undefined) {
            return ;
        }
        this.state.isReconnect = isReconnect;
    }

    template() {
        let action;
        if (this.state.isReconnect) {
            action = new ReconnectButtonComponent()
        } else if (isAuthorized()) {
            action = new PlayButtonComponent();
        } else {
            action = new InfoParagraphComponent("You have to sign in to play.");
        }

        return elem('div')
            .addChild(action)
    }
}