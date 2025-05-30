import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";
import Store from "../../../../store/store";
import User from "../../../../types/User";
import FriendListItemComponent from "./FriendListItemComponent";

export default class FriendListComponent extends FrontendyComponent {
    componentName: string = 'friend-list-componet';

    data() {
        return {
            friends: [
                new User({id: 1, rating: 1510, nickname: "tmazitov", avatar: "avatars/a8eb4228-57e5-472f-a839-e9199ff9bbb8-1-shifu.jpg", status: 0}),
                new User({id: 2, rating: 1140, nickname: "tmazitov", avatar: "avatars/a8eb4228-57e5-472f-a839-e9199ff9bbb8-1-shifu.jpg", status: 1}),
                new User({id: 3, rating: 890, nickname: "tmazitov", avatar: "avatars/a8eb4228-57e5-472f-a839-e9199ff9bbb8-1-shifu.jpg", status: 0}),
            ]
        }
    }

    template() {
        return elem('div')
            .setProps({class : "flex flex-col gap-2"})
            .setChild(this.state.friends.map((user:User) => {

                let imagePath: string | null = null;
                if (!user) {
                    imagePath = null
                } else if (user.avatarUrl && user.avatarUrl.startsWith("http")) {
                    imagePath = user.avatarUrl
                } else if (user.avatarUrl) {
                    imagePath = `http://localhost:5000/auth/public/${user.avatarUrl}`
                } else {
                    imagePath = "http://localhost:5000/auth/public/avatars/default.png"
                }

                user.avatarUrl = imagePath;

                console.log("imagePath", imagePath)

                return new FriendListItemComponent(user)
            }))
    }
}