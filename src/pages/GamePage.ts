import API from "../api/api";
import { getTokens } from "../api/client";
import GameComponent from "../components/content/game-page-content/GameComponent";
import GameWaitingModal from "../components/modals/GameWaitingModal";
import DashboardComponent from "../layouts/dashboard/DashboardLayout";
import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";
import Player from "../pkg/game/play/player";
import SERVER_ACTION from "../pkg/game/play/server";
import GameWebSocket from "../pkg/game/play/ws";
import Store from "../store/store";
import { MatchInfo } from "../types/MatchInfo";
import router from "./router";

export default class GamePage extends FrontendyComponent {
    componentName: string = 'game-page';



    template() {
        const dashboard = new DashboardComponent()
            .setSlot("content", new GameComponent())

        return elem("div")
            .setProps({ id: "game-page"})
            .setChild([
                elem("div")
                .setProps({ class : "flex flex-col items-center p-4 pt-8" })
                .setChild([
                    dashboard,

                ])
        ])
    }
}