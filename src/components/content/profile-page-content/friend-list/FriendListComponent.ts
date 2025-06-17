import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";
import ButtonComponent from "../../../inputs/ButtonComponent";
import AddFriendModal from "../../../modals/AddFriendModal";
import FriendListContentComponent from "./FrientListContentComponent";

export default class FriendListComponent extends FrontendyComponent {
    componentName: string = 'friend-list-componet';

    data() {
        return {
            isAddFriendModalOpen: false,
        }
    }


    template() {
        return elem('div')
        .setProps({class: "relative min-h-64"})
        .setChild([

            elem("div").addChild(new FriendListContentComponent()),

            elem("div")
            .setProps({class: "mt-4 flex justify-end"})
            .addChild(new ButtonComponent({
                label: "Add Friend",
                icon: "ti ti-plus",
                color: "blue",
                type: "outline",
            }).onClick(() => this.state.isAddFriendModalOpen = true)),

            new AddFriendModal()
            .setShow(this.state.isAddFriendModalOpen)
        ])
    }
}