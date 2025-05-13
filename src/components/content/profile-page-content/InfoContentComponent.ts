import API from "../../../api/api";
import router from "../../../pages/router";
import EventBroker from "../../../pkg/event-broker/eventBroker";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import Store from "../../../store/store";
import User from "../../../types/User";
import ButtonComponent from "../../inputs/ButtonComponent";
import TagComponent, { TagColor } from "../../inputs/TagComponent";
import DeleteAccountModal from "../../modals/DeleteAccountModal";

const statuses:Array<{icon:string, label:string, color: TagColor}> = [
    {icon: "ti ti-user-cancel", label : "Offline", color: "gray"},
    {icon: "ti ti-user", label : "Online", color: "green"},
    {icon: "ti ti-brand-apple-arcade", label : "Playing", color: "blue"},
]

export default class InfoContentComponent extends FrontendyComponent {
    componentName: string = 'info-content';

    protected data(){
        return {
            isDeleteAccountModalOpen: false,
            user: undefined,
        }
    }

    protected onCreated(): void {
        Store.getters.user().then((user:User|undefined) => {
            if (!user) {
                return 
            }
            this.state.user = user
        })
    }

    async signoutHandler() {

        await API.ums.signOut()

        router.push("home")
        EventBroker.getInstance().emit("update-auth");
    }
    
    template() {

        const status = statuses[1];

        return elem('div')
        .setProps({class: "flex gap-4 w-full"})
        .setChild([

            // Image container
            elem('div')
            .setProps({class: "size-32"})
            .setChild([
                elem('div')
                .setProps({class: "size-32 bg-gray-200 rounded-full"})
            ]),

            // Information container
            elem('div')
            .setProps({class: "w-full h-32"})
            .setChild([
                elem('div')
                .setProps({class: "flex flex-col gap-2 justify-between h-full"})
                .setChild([
                    elem('div')
                    .setProps({class: "flex gap-2 flex-col"})
                    .setChild([
                        elem('h2')
                        .setProps({class: "text-xl font-bold"})
                        .addChild(text(this.state.user?.nickname)),
    
                        elem('p')
                        .setProps({class: "text-gray-600 text-sm"})
                        .addChild(text("Played games: 0")),
                        
                        elem('p')
                        .setProps({class: "text-gray-600 text-sm"})
                        .addChild(text(`Rating: ${this.state.user?.rating}`)),
                    ]),

                    elem('div')
                    .setProps({class: "flex gap-2"})
                    .setChild([
                        new ButtonComponent({icon: "ti ti-settings", color: "blue", type: "outline"})
                        .onClick(() => router.push("profile-settings")),

                        new ButtonComponent({icon: "ti ti-logout", color: "red", type: "outline"})
                        .onClick(() => this.signoutHandler())
                    ]),
                ])
            ]),
        ])
    }
}