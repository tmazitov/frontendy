import Config from "../../../../config";
import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";
import Store from "../../../../store/store";
import User from "../../../../types/User";
import ButtonComponent from "../../../inputs/ButtonComponent";
import AddFriendModal from "../../../modals/AddFriendModal";
import DeleteFriendModal from "../../../modals/DeleteFriendModal";
import FriendListItemComponent from "./FriendListItemComponent";

export default class FriendListComponent extends FrontendyComponent {
    componentName: string = 'friend-list-componet';

    data() {
        return {
            friends: [
                new User({id: 1, rating: 1510, nickname: "sabdulki", avatar: "avatars/a8eb4228-57e5-472f-a839-e9199ff9bbb8-1-shifu.jpg", status: 0}),
                new User({id: 2, rating: 1140, nickname: "tmazitov", avatar: "avatars/a8eb4228-57e5-472f-a839-e9199ff9bbb8-1-shifu.jpg", status: 1}),
                new User({id: 3, rating: 890, nickname: "rnartdin", avatar: "avatars/a8eb4228-57e5-472f-a839-e9199ff9bbb8-1-shifu.jpg", status: 0}),
            ],
            friendToDelete: undefined,
            isAddFriendModalOpen: false,
        }
    }

    template() {
        return elem('div')
        .setChild([
            
            // Friend list
            elem('div')
            .setProps({class : "flex flex-col gap-2 max-h-96 overflow-auto "})
            .setChild(this.state.friends.map((user:User) => {

                let imagePath: string | null = null;
                if (!user) {
                    imagePath = null
                } else if (user.avatarUrl && user.avatarUrl.startsWith("http")) {
                    imagePath = user.avatarUrl
                } else if (user.avatarUrl) {
                    imagePath = `http://${Config.umsAddr}/public/${user.avatarUrl}`
                } else {
                    imagePath = `http://${Config.umsAddr}/public/avatars/default.png`
                }

                user.avatarUrl = imagePath;

                return new FriendListItemComponent(user)
                    .onDelete(() => this.state.friendToDelete = user)
            })),

            elem("div")
            .setProps({class: "mt-4"})
            .addChild(new ButtonComponent({
                label: "Add Friend",
                icon: "ti ti-plus",
                color: "blue",
                type: "outline",
            }).onClick(() => this.state.isAddFriendModalOpen = true)),

            // Delete friend modal
            new DeleteFriendModal(this.state.friendToDelete,)
            .setShow(this.state.friendToDelete !== undefined)
            .onSubmit(() => {
                this.state.friends = this.state.friends.filter((user: User) => user.id !== this.state.friendToDelete?.id);
                console.log({
                    friends: this.state.friends,
                })
                this.state.friendToDelete = undefined;
            }),

            new AddFriendModal()
            .setShow(this.state.isAddFriendModalOpen)
            .onSubmit((nickname: string) => {
                console.log("add friend", nickname);
            })
        ])
    }
}