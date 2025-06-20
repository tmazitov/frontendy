import { AxiosError } from "axios";
import API from "../../../../api/api";
import LoadingLayout from "../../../../layouts/loading/LoadingLayout";
import router from "../../../../pages/router";
import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem, text } from "../../../../pkg/frontendy/vdom/constructor";
import Store from "../../../../store/store";
import RatingChangeInfo from "../../../../types/RatingChangeInfo";
import User from "../../../../types/User";
import TagComponent, { TagColor } from "../../../inputs/TagComponent";
import ProfileAvatarComponent from "../ProfileAvatarComponent";
import RatingUpdateChartComponent from "../RatingUpdateChartComponent";
import PersonalContentComponent from "./PersonalContentComponent";
import OtherContentComponent from "./OtherContentComponent";
import BigAvatarComponent from "../../../inputs/BigAvatarComponent";

const statuses:Array<{icon:string, label:string, color: TagColor}> = [
    {icon: "ti ti-user-cancel", label : "Offline", color: "gray"},
    {icon: "ti ti-user", label : "Online", color: "green"},
    {icon: "ti ti-brand-apple-arcade", label : "Playing", color: "blue"},
]

export default class InfoContentComponent extends FrontendyComponent {
    componentName: string = 'info-content';

    constructor(){
        super();
        
        const currentRoute = router.currentRoute;
        const userId = currentRoute?.params?.userId;

        if (userId && !isNaN(parseInt(userId))) {
            this.state.shownUserId = parseInt(userId);
        }

    }

    protected data(){
        return {
            shownUserId: undefined,
        }
    }
    
    template() {
        return elem('span')
        .addChild(
            this.state.shownUserId !== undefined ?
            new OtherContentComponent(this.state.shownUserId) :
            new PersonalContentComponent()
        )
    }
}