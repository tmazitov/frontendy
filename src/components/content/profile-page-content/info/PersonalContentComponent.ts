import router from "../../../../pages/router";
import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";
import User from "../../../../types/User";
import ButtonComponent from "../../../inputs/ButtonComponent";
import RatingChangeInfo from "../../../../types/RatingChangeInfo";
import API from "../../../../api/api";
import EventBroker from "../../../../pkg/event-broker/eventBroker";
import Store from "../../../../store/store";
import ProfileAvatarComponent from "../ProfileAvatarComponent";
import RatingUpdateChartComponent from "../RatingUpdateChartComponent";
import MainInfoComponent from "./MainInfoComponent";

export default class PersonalContentComponent extends FrontendyComponent {
    componentName: string = 'personal-content-component';

    constructor(user?: User, ratingChangeInfo?: RatingChangeInfo) {
        super({user, ratingChangeInfo});
    }

    protected data(): {} {
        return {
            user: this.state.user || undefined,
            ratingChangeInfo: this.state.ratingChangeInfo || undefined,
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




    private async updateImageHandler(file:File) {

        const response = await API.ums.userUpdateAvatar(file)
        if (response === undefined) {
            console.log('Error while updating avatar', response);
            return
        }
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
        const avatarUrl = this.state.user?.avatarUrl;
        const fullAvatarUrl = API.ums.appropriateAvatar(avatarUrl);

        return elem('div')
        .setProps({class: "grid grid-cols-[8rem_1fr_18rem] gap-4 w-full"})
        .setChild([

            elem("span").addChild(new ProfileAvatarComponent(fullAvatarUrl)
            .onUpdate(this.updateImageHandler.bind(this))),

            elem("span").addChild(new MainInfoComponent(this.state.user, this.state.ratingChangeInfo, true)),

            elem("span").addChild(new RatingUpdateChartComponent({ rates: this.state.ratingChangeInfo?.updates}))
        ])
    }
}