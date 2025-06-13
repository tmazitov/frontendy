import router from "../../../pages/router";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import Store from "../../../store/store";
import { MatchResultInfo, MatchResultStatus } from "../../../types/MatchResultInfo";
import PlayersInfo from "../../../types/PlayersInfo";
import ButtonComponent from "../../inputs/ButtonComponent";
import InfoParagraphComponent from "../../inputs/InfoParagraphComponent";
import GameOverIconComponent from "./GameOverIconComponent";
import GameOverTitleComponent from "./GameOverTitleComponent";

export default class GameOverComponent extends FrontendyComponent {
    componentName: string = 'game-over-component';

    constructor(results: MatchResultInfo) {
        super({results})
    }

    protected data(): {} {
        return {
            gameInfo: {
                players: undefined,
                currentUserId: undefined,
            },
            shownInfo: {
                icon: undefined,
                title: undefined,
            }
        }
    }

    private updatePlayers(info:PlayersInfo | undefined) {
        console.log("GameOverComponent: updatePlayers called with info:", info);
        if (!info) {
            return ;
        }
        this.state.gameInfo.players = info.getPlayersPublicInfo();
        const icon = this.getAppropriateIcon(this.props.results.matchResult)
        const title = this.getAppropriateStatusMessage(this.props.results.matchResult)
        if (!icon || !title) {
            return ;
        }
        this.state.shownInfo = {icon, title};
    }

    private updateUserID(userId:number | undefined) {
        console.log("GameOverComponent: updateUserID called with userId:", userId);
        if (!userId) {
            return ;
        }
        this.state.gameInfo.currentUserId = userId;
        const icon = this.getAppropriateIcon(this.props.results.matchResult)
        const title = this.getAppropriateStatusMessage(this.props.results.matchResult)
        if (!icon || !title) {
            return ;
        }
        this.state.shownInfo = {icon, title};
    }

    protected onMounted(): void {
        Store.getters.gamePlayersInfo((info:PlayersInfo|undefined) => this.updatePlayers(info))
            .then((info:PlayersInfo|undefined) => this.updatePlayers(info))
        Store.getters.userId((userId:number|undefined) => this.updateUserID(userId))
            .then((userId:number|undefined) => this.updateUserID(userId))
    }

    getAppropriateStatusMessage(status:MatchResultStatus | undefined){
        if (!status) {
            return "";
        }

        const publicInfo = this.state.gameInfo.players
        const userId = this.state.gameInfo.currentUserId
        if (!publicInfo || !userId) {
            console.warn("GameOverComponent: publicInfo or userId is undefined", {publicInfo, userId});
            return undefined;
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
            console.warn("GameOverComponent: publicInfo or userId is undefined", {publicInfo, userId});
            return undefined;
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
        return elem('div')
            .setProps({class: 'p-[16px] w-[512px] relative flex flex-col items-center gap-4 align-center'})
            .setChild([
                new GameOverIconComponent(this.state.shownInfo.icon),

                new GameOverTitleComponent(this.state.shownInfo.title),

                new ButtonComponent({
                    label: "Home",
                    color: "blue",
                }).onClick(() => router.push('home')),
            ])
    }
}