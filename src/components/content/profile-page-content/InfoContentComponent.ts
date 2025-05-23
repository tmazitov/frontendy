import API from "../../../api/api";
import router from "../../../pages/router";
import EventBroker from "../../../pkg/event-broker/eventBroker";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import Store from "../../../store/store";
import User from "../../../types/User";
import ButtonComponent from "../../inputs/ButtonComponent";
import TagComponent, { TagColor } from "../../inputs/TagComponent";
import ProfileAvatarComponent from "./ProfileAvatarComponent";

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

    async updateImageHandler(file:File) {
        console.log('file :>> ', file);

        const response = await API.ums.userUpdateAvatar(file)
        if (response.status != 200) {
            console.log('Error while updating avatar', response);
            return
        }

        const user:User = this.state.user
        this.state.user = undefined
        user.avatarUrl = response.data.avatar
        this.state.user = user 
    }
    
    template() {

        let imagePath
        console.log({url: this.state.user, methods: this.state.user?.avatarUrl?.startsWith})
        if (!this.state.user) {
            imagePath = null
        } else if (this.state.user.avatarUrl && this.state.user.avatarUrl.startsWith("http")) {
            imagePath = this.state.user.avatarUrl
        } else if (this.state.user.avatarUrl) {
            imagePath = `http://localhost:5000/auth/public/${this.state.user.avatarUrl}`
        } else {
            imagePath = "http://localhost:5000/auth/public/avatars/default.png"
        }
    
        console.log('imagePath :>> ', imagePath);

        return elem('div')
        .setProps({class: "grid grid-cols-[8rem_1fr] gap-4 w-full"})
        .setChild([

            // Image container
            elem('span')
            .setChild([
                new ProfileAvatarComponent(imagePath)
                .onUpdate(async (file: File) => this.updateImageHandler(file))
            ]),

            // Information container
            elem('div')
            .setProps({class: "h-32"})
            .setChild([
            elem('div')
            .setProps({class: "flex flex-col gap-2 justify-between h-full "})
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