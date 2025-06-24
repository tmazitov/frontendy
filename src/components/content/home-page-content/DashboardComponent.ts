import API from "../../../api/api";
import { isAuthorized } from "../../../api/client";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import Store from "../../../store/store";
import InfoParagraphComponent from "../../inputs/InfoParagraphComponent";
import PlayButtonComponent from "./PlayButtonComponent";
import RatingLeaderboardComponent from "./RatingLeaderboardComponent";
import ReconnectButtonComponent from "./ReconnectButtonComponent";

export default class DashboardComponent extends FrontendyComponent {
    componentName: string = 'home-dashboard-component';

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

        return elem("div")
            .setProps({ 
                id: "home-dashboard-component",
                class : "max-w-2xl w-full rounded-lg overflow-hidden shadow-md bg-white p-6", 
            })
            .setChild([
                elem("h1")
                .setProps({ class : "text-2xl font-bold mb-4" })
                .addChild(text(`Home`)),
                
                new InfoParagraphComponent("Welcome to the ft_transcendence!"),
                new InfoParagraphComponent("There you can explore a rating leaderboard."),

                new RatingLeaderboardComponent(),
                
                action,
            ]);
    }
}   