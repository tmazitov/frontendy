import API from "../../../../api/api";
import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";
import Store from "../../../../store/store";
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
            friendToDelete: undefined,
        }
    }

    private onDeleteFriendHandler(user:User) {
        Store.setters.deleteFriend(user.id)
    }

    template() {
        return elem('div')
        .setChild([
            elem('div')
            .setProps({class : "flex flex-col gap-2 min-h-64 max-h-96 overflow-auto "})
            .setChild(this.props.friends.map((user:User) => {
    
                user.avatarUrl = API.ums.appropriateAvatar(user.avatarUrl);
    
                return new FriendListItemComponent(user)
                    .onDelete(() => this.state.friendToDelete = user)
            })),
    
            // Delete friend modal
            new DeleteFriendModal(this.state.friendToDelete,)
            .setShow(this.state.friendToDelete !== undefined)
            .onSubmit(() => this.onDeleteFriendHandler(this.state.friendToDelete as User))
        ])
    }
}