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

    constructor(matchStartWaitingConf: {timeLeft: number, matchIsReady: boolean}) {
        super({matchStartWaitingConf});
    }

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

        })
    }

    template() {

        console.log("wait config", this.props.matchStartWaitingConf);

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