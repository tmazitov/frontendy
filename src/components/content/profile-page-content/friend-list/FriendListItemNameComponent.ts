import router from "../../../../pages/router";
import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";

export default class FriendListItemNameComponent extends FrontendyComponent {
    componentName: string = 'friend-list-item-name-component';

    constructor(title:string, id: number) {
        super({title, id});
    }

    onClickHandler(){
        router.push("profile-friend", {
            params: {
                userId: this.props.id,
            }
        })
    }

    template() {
        return elem("h4")
            .setProps({class: "font-semibold text-lg transition-all duration-200 hover:underline cursor-pointer"})
            .addChild(this.props.title)
            .addEventListener("click", () => this.onClickHandler())
    }
}