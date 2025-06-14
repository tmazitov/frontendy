import API from "../../../api/api";
import Config from "../../../config";
import LoadingLayout from "../../../layouts/loading/LoadingLayout";
import router from "../../../pages/router";
import EventBroker from "../../../pkg/event-broker/eventBroker";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import Store from "../../../store/store";
import RatingChangeInfo from "../../../types/RatingChangeInfo";
import User from "../../../types/User";
import ButtonComponent from "../../inputs/ButtonComponent";
import TagComponent, { TagColor } from "../../inputs/TagComponent";
import ProfileAvatarComponent from "./ProfileAvatarComponent";
import RatingUpdateChartComponent from "./RatingUpdateChartComponent";

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
            ratingChangeInfo: undefined,
        }
    }

    protected onCreated(): void {
        Store.getters.user((user:User|undefined) => {
            if (!user) {
                return ;
            }
            this.state.user = user;
        })
        Store.setters.setupRatingChanges()
        Store.getters.userRatingChanges((info: RatingChangeInfo|undefined) => {
            if (!info) {
                return ;
            }

            this.state.ratingChangeInfo = info;
        })
    }

    async signoutHandler() {

        await API.ums.signOut()

        router.push("home")
        Store.setters.deleteUser()
        EventBroker.getInstance().emit("update-auth");
    }

    async updateImageHandler(file:File) {

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
        if (!this.state.user) {
            imagePath = null
        } else if (this.state.user.avatarUrl && this.state.user.avatarUrl.startsWith("http")) {
            imagePath = this.state.user.avatarUrl
        } else if (this.state.user.avatarUrl) {
            imagePath = `http://${Config.umsAddr}/public/${this.state.user.avatarUrl}`
        } else {
            imagePath = `http://${Config.umsAddr}/public/avatars/default.png`
        }
        


        const ratingChart = this.state.ratingChangeInfo === undefined ? 
            new LoadingLayout({
                label: "Loading rating updates...",
                icon: "ti ti-loader",
            }).setShow(true) : 
            new RatingUpdateChartComponent({ rates: this.state.ratingChangeInfo.updates})


        return elem('div')
        .setProps({class: "grid grid-cols-[8rem_1fr_18rem] gap-4 w-full"})
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
                        .addChild(text(`Played games: ${this.state.ratingChangeInfo?.playedMatches ?? 0}`)),
                        
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

            elem('div')
            .setProps({class: "relative h-32"})
            .addChild(ratingChart)
        ])
    }
}