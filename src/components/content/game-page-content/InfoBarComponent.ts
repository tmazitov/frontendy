import API from "../../../api/api";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import Store from "../../../store/store";
import PlayersInfo from "../../../types/PlayersInfo";
import SmallAvatarComponent from "../../inputs/SmallAvatarComponent";

export default class InfoBarComponent extends FrontendyComponent {
    componentName: string = 'info-bar-component';

    data() {
        return {
            player1Nickname: "nickname 1",
            player2Nickname: "nickname 2",
            player1Avatar: null,
            player2Avatar: null,
            player1Score: 0,
            player2Score: 0,
        }
    }

    protected onMounted(): void {
        Store.getters.gamePlayersInfo((info:PlayersInfo | undefined) => {
            if (!info) {
                console.warn("InfoBarComponent: gamePlayersInfo is undefined");
                return;
            }
            const playersInfo = info.getPlayersPublicInfo();
            this.state.player1Nickname = playersInfo.player1.nickname;
            this.state.player2Nickname = playersInfo.player2.nickname;
            this.state.player1Score = playersInfo.player1.score;
            this.state.player2Score = playersInfo.player2.score;
        })
    }

    template() {

        const player1Avatar = this.state.player1Avatar ?
            this.state.player1Avatar : API.ums.defaultAvatarUrl()

        const player2Avatar = this.state.player2Avatar ?
            this.state.player2Avatar : API.ums.defaultAvatarUrl()

        return elem('div')
            .setProps({ class: "flex justify-between items-center p-4 w-[512px] "})
            .setChild([
                elem('div')
                .setProps({ class: "text-bold text-md flex gap-2 items-center"})
                .setChild([
                    new SmallAvatarComponent({imagePath: player1Avatar}),
                    this.state.player1Nickname
                ]),

                elem('div')
                .setProps({ class: "text-bold text-lg"})
                .addChild(`${this.state.player1Score} : ${this.state.player2Score}`),
                
                elem('div')
                .setProps({ class: "text-bold text-md flex gap-2 items-center"})
                .setChild([
                    new SmallAvatarComponent({imagePath: player2Avatar}),
                    this.state.player2Nickname,
                ]),
            ])
    }
}