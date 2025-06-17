import API from "../../../../api/api";
import Config from "../../../../config";
import LoadingLayout from "../../../../layouts/loading/LoadingLayout";
import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";
import Store from "../../../../store/store";
import User from "../../../../types/User";
import ButtonComponent from "../../../inputs/ButtonComponent";
import AddFriendModal from "../../../modals/AddFriendModal";
import DeleteFriendModal from "../../../modals/DeleteFriendModal";
import FriendListItemComponent from "./FriendListItemComponent";
import ListComponent from "./ListComponent";
import ListEmptyComponent from "./ListEmptyComponent";

export default class FriendListComponent extends FrontendyComponent {
    componentName: string = 'friend-list-componet';

    data() {
        return {
            friends: undefined,
            isAddFriendModalOpen: false,
        }
    }

    protected onCreated(): void {
        Store.setters.setupFriends()
        Store.getters.userFriends((friends: User[]| undefined) => this.state.freinds = friends || [])
            .then((friends: User[] | undefined) => this.state.friends = friends || []);
    }

    template() {

        let content
        if (this.state.friends === undefined) {
            content = new LoadingLayout({
                label: "Loading friends...",
                icon: "ti ti-loader",
            })
        } else if (this.state.friends.length === 0) {
            content = new ListEmptyComponent()
        } else {
            content = new ListComponent(this.state.friends)
        }

        return elem('div')
        .setProps({class: "relative min-h-64"})
        .setChild([

            elem("span").addChild(content),

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
            .onSubmit((nickname: string) => {
                console.log("add friend", nickname);
            })
        ])
    }
}