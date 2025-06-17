import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";
import Store from "../../../../store/store";
import FriendInvite from "../../../../types/FriendInvite";
import ButtonComponent from "../../../inputs/ButtonComponent";

export default class InvitesListComponent extends FrontendyComponent {
    componentName: string = 'invites-list-component';

    data() {
        return {
            invites: [],
            userId: 0,
        }
    }

    protected onCreated(): void {
        Store.getters.userFriendsInvites((invites: FriendInvite[] | undefined) => this.state.invites = invites || [])
            .then((invites: FriendInvite[] | undefined) => this.state.invites = invites || [])

        Store.getters.userId((userId: number | undefined) => {
            if (userId === undefined) {
                console.error("InvitesListComponent error: userId is undefined");
                return;
            }
            this.state.userId = userId;
        })
    }

    private onDeleteInvite(inviteId: number) {
        Store.setters.deleteFriendInvite(inviteId)
    }

    template() {

        const elems = this.state.invites.map((invite: FriendInvite) => {

            const buttons:Array<FrontendyComponent> = []
            if (invite.authorId == this.state.userId) {
                buttons.push(new ButtonComponent({
                    icon: "ti ti-trash",
                    type: "outline",
                    color: "red",
                    size: "small",
                }).onClick(() => this.onDeleteInvite(invite.id)))
            } else {
                buttons.push(new ButtonComponent({
                    icon: "ti ti-check",
                    type: "outline",
                    color: "green",
                    size: "small",
                })) 
                buttons.push(new ButtonComponent({
                    icon: "ti ti-x",
                    type: "outline",
                    color: "red",
                    size: "small",
                }))
            }
            return elem("div")
            .setProps({class: "friend-item w-full select-none flex items-center justify-between gap-4 py-2 px-4 border-1 border-gray-200 rounded-md hover:border-blue-300 transition-all duration-200"})
            .setChild([
                elem("div")
                .addChild(invite.nickname),

                elem("div")
                .setProps({class: "friend-item-buttons flex items-center gap-4 opacity-0 transition-all duration-200"})
                .setChild(buttons)
            ])
        })

        return elem('div').setChild(elems)
    }
}