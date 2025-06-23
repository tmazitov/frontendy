import API from "../../../api/api";
import { getTokens } from "../../../api/client";
import Config from "../../../config";
import games from "../../../data/games";
import router from "../../../pages/router";
import EventBroker from "../../../pkg/event-broker/eventBroker";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import GameLauncher from "../../../pkg/game/launcher/gameLauncher";
import TimerStorage from "../../../pkg/timer";
import Store from "../../../store/store";
import { MatchResultInfo, MatchResultStatus } from "../../../types/MatchResultInfo";
import PlayersInfo from "../../../types/PlayersInfo";
import ButtonComponent from "../../inputs/ButtonComponent";
import InfoParagraphComponent from "../../inputs/InfoParagraphComponent";
import MessageComponent from "../../inputs/MessageComponent";
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



    protected onCreated(): void {
        TimerStorage.removeTimer(`game-paddle-left`);
        TimerStorage.removeTimer(`game-paddle-right`);
        TimerStorage.removeTimer(`game-ball`);

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

        const isTournament = this.props.results.isTournament

        switch (status) {
            case 'FAIL':
                return "Game failed";
            case 'P1WIN':
                if (isTournament && publicInfo.player1.id == userId) {   
                    return "You won! Proceed to the next round.";
                } else if (publicInfo.player1.id == userId) {
                    return "You won!"
                } else {
                    return "You lost."
                }
            case 'P2WIN':
                if (isTournament && publicInfo.player2.id == userId) {
                    return "You won! Proceed to the next round."
                } else if (publicInfo.player2.id == userId) {
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

    isWinner(status: MatchResultStatus | undefined): boolean {
        const publicInfo = this.state.gameInfo.players
        const userId = this.state.gameInfo.currentUserId
        if (!publicInfo || !userId) {
            console.warn("GameOverComponent: publicInfo or userId is undefined", {publicInfo, userId});
            return false;
        }
        return (status === 'P1WIN' && publicInfo.player1.id === userId) ||
               (status === 'P2WIN' && publicInfo.player2.id === userId);
    }

    template() {

        const buttons = []
        const isWinner = this.isWinner(this.props.results.matchResult)

        if (this.props.results.isTournament && isWinner) {
            buttons.push(new MessageComponent("Wait for the next round!", {color: "blue"}))
        } else {
            buttons.push(new ButtonComponent({
                label: "Home",
                color: "blue",
            }).onClick(() => router.push('home')))
        }

        return elem('div')
            .setProps({class: 'p-[16px] w-[512px] relative flex flex-col items-center gap-4 align-center'})
            .setChild([
                new GameOverIconComponent(this.state.shownInfo.icon),

                new GameOverTitleComponent(this.state.shownInfo.title),

                ...buttons
            ])
    }
}