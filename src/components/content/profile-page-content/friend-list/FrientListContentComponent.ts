import LoadingLayout from "../../../../layouts/loading/LoadingLayout";
import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";
import Store from "../../../../store/store";
import FriendInvite from "../../../../types/FriendInvite";
import User from "../../../../types/User";
import AccordionComponent from "../../../inputs/AccordionComponent";
import InvitesListComponent from "./InvitesListComponent";
import ListComponent from "./ListComponent";
import ListEmptyComponent from "./ListEmptyComponent";

export default class FriendListContentComponent extends FrontendyComponent {
    componentName: string = 'friend-list-content-component';

    data() {
        return {
            friends: undefined,
            invites: undefined,
        }
    }

    protected onCreated(): void {
        Store.setters.setupFriends();
        Store.setters.setupFriendsInvites();
        Store.getters.userFriends((friends: User[]| undefined) => this.userFriendsUpdate(friends))
        Store.getters.userFriendsInvites((invites: FriendInvite[] | undefined) => this.state.invites = invites || [])
    }

    private userFriendsUpdate(friends: User[]| undefined) {
        this.state.friends = friends ?? []
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
            .setChild([
                elem("span").addChild(new AccordionComponent({
                    items: [
                        { title: `Invites: ${this.state.invites?.length || 0}`, content: InvitesListComponent}
                    ]
                })),
    
                elem("span").addChild(content),
            ])
    }
}