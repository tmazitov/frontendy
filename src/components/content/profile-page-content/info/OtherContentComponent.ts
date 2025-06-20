import { AxiosError } from "axios";
import API from "../../../../api/api";
import router from "../../../../pages/router";
import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";
import RatingChangeInfo from "../../../../types/RatingChangeInfo";
import User from "../../../../types/User";
import BigAvatarComponent from "../../../inputs/BigAvatarComponent";
import RatingUpdateChartComponent from "../RatingUpdateChartComponent";
import ProfileAvatarComponent from "../ProfileAvatarComponent";
import MainInfoComponent from "./MainInfoComponent";

export default class OtherContentComponent extends FrontendyComponent {
    componentName: string = 'other-content-component';

    constructor(userId:number) {
        super({userId})
    }

    data() {
        return {
            info: {
                user : undefined,   
                ratingChangeInfo: undefined,
            }
        }
    }

    protected onCreated(): void {
        this.setupOtherUser(this.props.userId);
        this.setupOtherUserRating(this.props.userId);   
    }

    private setupOtherUser(userId:number) {
        API.ums.userGetInfo(userId)
        .then((response) => {
            if (response.status == 200) {
                this.state.info.user = new User(response.data);
                if (this.state.info.user && this.state.info.ratingChangeInfo) {
                    this.state.info = {
                        ratingChangeInfo: this.state.info.ratingChangeInfo,
                        user: this.state.info.user,
                    }
                }
            }
        })
        .catch((error) => {
            if (error instanceof AxiosError && error.response?.status == 404) {
                router.push("undefined-page")
            }
        })
    }

    private setupOtherUserRating(userId:number) {
        API.mmrs.userRatingUpdates(userId)
        .then((response) => {
            if (response.status == 200) {
                const values:{date:Date, rate:number} = response.data.updates
                .map((update: {date: string, rate: number}) => {
                    return {date: new Date(update.date), rate: update.rate};
                })
                .sort((a:{date:Date, rate:number}, b:{date:Date, rate:number}) => a.date.getTime() - b.date.getTime())

                this.state.info.ratingChangeInfo = {
                    playedMatches: response.data.playedMatches,
                    updates: values,
                }

                if (this.state.info.user && this.state.info.ratingChangeInfo) {
                    this.state.info = {
                        ratingChangeInfo: this.state.info.ratingChangeInfo,
                        user: this.state.info.user,
                    }
                }
            }
        })
        .catch((error) => {
            if (error instanceof AxiosError && error.response?.status == 404) {
                router.push("undefined-page")
            }
        })
    }

    template() {

        const avatarUrl = this.state.info.user?.avatarUrl;
        const fullAvatarUrl = API.ums.appropriateAvatar(avatarUrl);

  

        return elem('div')
        .setProps({class: "grid grid-cols-[8rem_1fr_18rem] gap-4 w-full"})
        .setChild([
            elem("span").addChild(new BigAvatarComponent({imagePath: fullAvatarUrl})),

            elem("span").addChild(new MainInfoComponent(this.state.info.user, this.state.info.ratingChangeInfo)),

            elem("span").addChild(new RatingUpdateChartComponent({ rates: this.state.info.ratingChangeInfo?.updates})),
        ])
    }
}