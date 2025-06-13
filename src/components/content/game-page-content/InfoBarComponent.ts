import API from "../../../api/api";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import Store from "../../../store/store";
import PlayersInfo from "../../../types/PlayersInfo";
import InfoParagraphComponent from "../../inputs/InfoParagraphComponent";
import MessageComponent from "../../inputs/MessageComponent";
import SmallAvatarComponent from "../../inputs/SmallAvatarComponent";

export default class InfoBarComponent extends FrontendyComponent {
    componentName: string = 'info-bar-component';

    data() {
        return {
            players: {
                player1: {
                    nickname: undefined,
                    avatar: undefined,
                    score: 0,
                },
                player2: {
                    nickname: undefined,
                    avatar: undefined,
                    score: 0,
                },
            }
        }
    }

    protected onMounted(): void {
        Store.getters.gamePlayersInfo((info:PlayersInfo | undefined) => {
            if (!info) {
                console.warn("InfoBarComponent: gamePlayersInfo is undefined");
                return;
            }
            const playersInfo = info.getPlayersPublicInfo();
            this.state.players = {
                player1: {
                    nickname: playersInfo.player1.nickname,
                    avatar: playersInfo.player1.avatar, 
                    score: playersInfo.player1.score,
                },
                player2: {
                    nickname: playersInfo.player2.nickname,
                    avatar: playersInfo.player2.avatar,
                    score: playersInfo.player2.score,
                }
            }
        })
    }

    template() {

        const player1Avatar = this.state.players.player1.avatar ?
            this.state.players.player1.avatar : API.ums.defaultAvatarUrl()

        const player1Nickname = this.state.players.player1.nickname ?
            this.state.players.player1.nickname : "Player 1";

        const player2Avatar = this.state.players.player2.avatar ?
            this.state.players.player2.avatar : API.ums.defaultAvatarUrl()

        const player2Nickname = this.state.players.player2.nickname ?
            this.state.players.player2.nickname : "Player 2";

        return elem('div')
            .setProps({ class: "flex justify-between items-center p-4 w-[512px] "})
            .setChild([
            elem('div')
            .setProps({ class: "text-bold text-md flex gap-2 items-center flex-1 justify-start"})
            .setChild([
                new SmallAvatarComponent({imagePath: player1Avatar}),
                new MessageComponent(player1Nickname, {color: "black"}),
            ]),

            elem('div')
            .setProps({ class: "text-bold text-lg"})
            .addChild(`${this.state.players.player1.score} : ${this.state.players.player2.score}`),
            
            elem('div')
            .setProps({ class: "text-bold text-md flex gap-2 items-center flex-1 justify-end"})
            .setChild([
                new MessageComponent(player2Nickname, {color: "black"}),
                new SmallAvatarComponent({imagePath: player2Avatar}),
            ]),
            ])
    }
}