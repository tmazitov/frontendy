import API from "../../api/api";
import { getTokens } from "../../api/client";
import Config from "../../config";
import LoadingLayout from "../../layouts/loading/LoadingLayout";
import ModalLayout from "../../layouts/modal/ModalLayout";
import EventBroker from "../../pkg/event-broker/eventBroker";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import GameLauncher from "../../pkg/game/launcher/gameLauncher";
import Store from "../../store/store";
import Game from "../../types/Game";
import GameLauchBodyComponent from "../content/game-launch-modal-content/BodyComponent";

export default class GameLauncherModal extends FrontendyComponent {
    componentName: string = 'game-launch-modal';

    data() {
        return {
            userId: undefined, 
            show: false,
            isLoading: false,
        }
    }

    protected onCreated(): void {
        Store.getters.userId().then((userId: number | undefined) => {
            this.state.userId = userId;
        })
    }


    public setShow(value: boolean) {
        this.state.show = value;
        return this 
    }

    private onSubmit(game: Game) {
        if (!this.state.userId) {
            console.error("GameLauncherModal error : userId is undefined");
            return;
        }
 
        this.state.isLoading = true;

        const accessToken = getTokens()?.accessToken
        if (!accessToken) {
            return ;
        }

        const onAuthorized = () => {
            this.state.show = false;
            this.state.isLoading = false;
        }
        
        let onUnauthorizedIsCalled = false;
        const onUnauthorized = () => {
            if (onUnauthorizedIsCalled) {
                console.warn("GameLauncherModal : onUnauthorized is called multiple times");
                this.state.show = false;
                this.state.isLoading = false;
                return ;
            }
            onUnauthorizedIsCalled = true;

            API.ums.refresh().then((response) => {
                const newTokens = getTokens();
                if (!newTokens || !newTokens.accessToken) {
                    console.warn("GameLauncherModal : accessToken is undefined after refresh");
                    this.state.show = false;
                    this.state.isLoading = false;
                    return ;
                }
                
                GameLauncher.startGameSearching(newTokens.accessToken, game, {
                    serverAddr: Config.mmrsAddr,
                    onConnectedCallback: onAuthorized,
                    onUnauthorizedCallback: onUnauthorized,
                });
            })
        }


        GameLauncher.startGameSearching(accessToken, game, {
            serverAddr: Config.mmrsAddr,
            onConnectedCallback: onAuthorized,
            onUnauthorizedCallback: onUnauthorized,
        });
    }

    template() {
        return elem('span')
            .setChild([
                new ModalLayout("game-launch-modal", {
                    onClose: () => this.state.show = false,
                    customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white"
                })
                .setShow(this.state.show)
                .setSlot("header", 
                    elem("h2")
                    .setProps({ class: "text-lg font-bold" })
                    .addChild(text("Game Launcher")))
                .setSlot("body", 
                    elem("span")
                    .setChild([
                        new LoadingLayout({
                            label: "Please wait...", 
                            icon: "ti ti-loader"
                        }).setShow(this.state.isLoading),
                        new GameLauchBodyComponent({
                            onSubmit: this.onSubmit.bind(this),
                        }),
                    ])
                )
            ])
    }
}