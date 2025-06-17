import API from "../../../../api/api";
import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";
import User from "../../../../types/User";
import DeleteFriendModal from "../../../modals/DeleteFriendModal";
import FriendListItemComponent from "./FriendListItemComponent";

export default class ListComponent extends FrontendyComponent {
    componentName: string = 'list-component';

    constructor(friends:Array<User>) {
        super({ friends });
    }

    protected data(){
        return {
            friendToDelete: false,
        }
    }

    template() {
        return elem('div')
        .setChild([
            elem('div')
            .setProps({class : "flex flex-col gap-2 max-h-96 overflow-auto "})
            .setChild(this.props.friends.map((user:User) => {
    
                user.avatarUrl = API.ums.appropriateAvatar(user.avatarUrl);
    
                return new FriendListItemComponent(user)
                    .onDelete(() => this.state.friendToDelete = user)
            })),
    
            // Delete friend modal
            new DeleteFriendModal(this.state.friendToDelete,)
            .setShow(this.state.friendToDelete !== undefined)
            .onSubmit(() => {
                // this.state.friends = this.state.friends.filter((user: User) => user.id !== this.state.friendToDelete?.id);
                // console.log({
                //     friends: this.state.friends,
                // })
                // this.state.friendToDelete = undefined;
            })
        ])
    }
}