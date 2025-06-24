import ModalLayout from "../../layouts/modal/ModalLayout";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";
import Store from "../../store/store";
import { MatchResultInfo, MatchResultStatus } from "../../types/MatchResultInfo";
import PlayersInfo from "../../types/PlayersInfo";
import InfoParagraphComponent from "../inputs/InfoParagraphComponent";


export default class GameOverModal extends FrontendyComponent {
    // componentName: string = 'game-over-modal';

    data() {
        return {
            gameResult: undefined,
            gameInfo: {
                players: undefined,
                currentUserId: undefined,
            }
        }
    }

    protected onMounted(): void {
        Store.getters.gameResults((results:MatchResultInfo|undefined) => {
            console.log(this.componentName, "match updated result in GameOverModal, ", results, "is new", this.state.gameResult !== results )
            if (!results && this.state.gameResult !== results) {
                return ;
            }
            this.state.gameResult = results;
            this.update();
        })
        Store.getters.gamePlayersInfo((info:PlayersInfo | undefined) => {
            if (!info) {
                return ;
            }
            this.state.gameInfo.players = info.getPlayersPublicInfo();
        })
        Store.getters.userId((userId: number |undefined) => {
            if (!userId) {
                return ;
            }
            this.state.gameInfo.currentUserId = userId;
        })
    }

    getAppropriateStatusMessage(status:MatchResultStatus | undefined){
        if (!status) {
            return "";
        }

        const publicInfo = this.state.gameInfo.players
        const userId = this.state.gameInfo.currentUserId
        if (!publicInfo || !userId) {
            return "";
        }

        switch (status) {
            case 'FAIL':
                return "Game failed";
            case 'P1WIN':
                if (publicInfo.player1.id == userId) {
                    return "You won!"
                } else {
                    return "You lost."
                }
            case 'P2WIN':
                if (publicInfo.player2.id == userId) {
                    return "You won!"
                } else {
                    return "You lost."
                }
        }
        return "";
    }
    getAppropriateIcon(status:MatchResultStatus | undefined) {
        if (!status) {
            return "progress text-blue-500";
        }
        const publicInfo = this.state.gameInfo.players
        const userId = this.state.gameInfo.currentUserId
        if (!publicInfo || !userId) {
            return "bug text-red-500"
        }

        switch (status) {
            case 'FAIL':
                return "mood-sad-dizzy text-red-500";
            case 'P1WIN':
                if (publicInfo.player1.id == userId) {
                    return "crown text-yellow-500"
                } else {
                    return "mood-sad"
                }
            case 'P2WIN':
                if (publicInfo.player2.id == userId) {
                    return "crown text-yellow-500"
                } else {
                    return "mood-sad"
                }
        }
        return "mood-sad";
    }

    template() {

        const modalIsVisible = this.state.gameResult !== undefined
        const result = this.state.gameResult as MatchResultInfo | undefined
        const resultStatus = result?.matchResult  


        // Header
        const header = elem("h2")
        .setProps({ class: "text-lg font-semibold text-gray-800" })
        .addChild(`Game over!`);

        // Body
        const body = elem("div")
            .setProps({ class: "flex flex-col gap-4" })
            .setChild([
                elem("i").setProps({class: `ti ti-${this.getAppropriateIcon(resultStatus)} h-16 w-16`}),
                new InfoParagraphComponent(this.getAppropriateStatusMessage(resultStatus)),
                "test",
            ])

        return elem('span').addChild(
            new ModalLayout("game-launch-modal", {
                customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white",
            })
            .setShow(modalIsVisible)
            .setSlot("body", body)
            .setSlot("header", header)
        )
    }
}