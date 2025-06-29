import API from "../../../../api/api";
import router from "../../../../pages/router";
import EventBroker from "../../../../pkg/event-broker/eventBroker";
import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";
import Store from "../../../../store/store";
import RatingChangeInfo from "../../../../types/RatingChangeInfo";
import User from "../../../../types/User";
import ButtonComponent from "../../../inputs/ButtonComponent";
import TagComponent from "../../../inputs/TagComponent";
import NicknameComponent from "./NicknameComponent";

export default class MainInfoComponent extends FrontendyComponent {
    componentName: string = 'main-info-component';

    constructor(user?: User, ratingChangeInfo?: RatingChangeInfo, withButtons: boolean = false) {
        super({user, ratingChangeInfo, withButtons});
    }

    private async signoutHandler() {

        await API.ums.signOut()

        router.push("home")
        Store.setters.deleteUser()
        EventBroker.getInstance().emit("update-auth");
    }

    template() {

        const buttons = []

        if (this.props.withButtons) {
            buttons.push(...[
                new ButtonComponent({icon: "ti ti-settings", color: "blue", type: "outline"})
                .onClick(() => router.push("profile-settings")),
    
                new ButtonComponent({icon: "ti ti-logout", color: "red", type: "outline"})
                .onClick(() => this.signoutHandler())
            ])
        }

        const headers:Array<any> = [
            new NicknameComponent(`${this.props.user?.nickname ?? ''}`)
        ]
        
        if (!this.props.withButtons) {
            const tag = new TagComponent({
                label: this.props.user?.isOnline ?
                    'Online' : 'Offline',
                color: this.props.user?.isOnline ? 
                    'green' : 'gray'
            })

            headers.unshift(tag)
        }

        return elem('div')
        .setProps({class: "flex flex-col gap-2 justify-between h-full "})
        .setChild([
            elem('div')
            .setProps({class: "flex gap-2 flex-col"})
            .setChild([
            elem('h2')
                .setProps({class: "flex gap-2 items-center"})
                .setChild(headers),
        
                elem('p')
                .setProps({class: "text-gray-600 text-sm"})
                .addChild(`Played games: ${this.props.ratingChangeInfo?.playedMatches ?? 0}`),
                
                elem('p')
                .setProps({class: "text-gray-600 text-sm"})
                .addChild(`Rating: ${this.props.user?.rating}`),
                
                elem('div')
                .setProps({class: "flex gap-2"})
                .setChild(buttons)
            ]),
        ])
    }
}