import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import Player from "../../../pkg/game/play/player";
import SERVER_ACTION from "../../../pkg/game/play/server";
import GameProc from "../../../pkg/game/play/ws";
import Store from "../../../store/store";
import GameDisconectedModal from "../../modals/GameDisconectedModal";
import InfoBarComponent from "./InfoBarComponent";
import SceneComponent from "./SceneComponent";

export default class GameComponent extends FrontendyComponent {
    componentName: string = 'game-component';

    data() {    
        return {
            opponentDisconected: false,
        }
    }

    protected onMounted(): void {
        GameProc.on(SERVER_ACTION.MatchOpponentDisconnected, () => {
            this.state.opponentDisconected = true;
        })
        GameProc.on(SERVER_ACTION.MatchOpponentReconected, () => {
            this.state.opponentDisconected = false;
        })

        GameProc.on(SERVER_ACTION.MatchStart, (data: any) => {
            if (!data) { 
                console.warn("MatchStart warning: data is undefined");
                return ;
            }

            const state = data as {
                player1: {
                    id: number,
                    score: number,
                },
                player2: {
                    id: number,
                    score: number,
                }
            };
            if (!state.player1 || !state.player2) {
                console.warn("MatchStart warning: player IDs are missing");
                return ;
            }

            Store.setters.setupGamePlayersInfo(state.player1, state.player2);
        })
    }

    template() {
        return elem('div')
            .setProps({class : "flex items-center flex-col"})
            .setChild([
                new InfoBarComponent(),
                new SceneComponent({
                    isOpponentDisconected: this.state.opponentDisconected,
                }),

                new GameDisconectedModal("opponent nickname").setShow(this.state.opponentDisconected)
            ])
    }
}