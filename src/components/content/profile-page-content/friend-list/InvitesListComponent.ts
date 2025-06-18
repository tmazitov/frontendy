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

    private nicknameWrapper(nickname: string, isAuthor: boolean) {
        if (isAuthor) {
            return `You have send an invite to <span class="text-black text-bold">${nickname}</span>`;
        }
        return `<span class="text-black text-bold">${nickname}</span> has sent you an invite`;
    }

    template() {

        const elems = this.state.invites.map((invite: FriendInvite) => {

            const buttons:Array<FrontendyComponent> = []
            const isAuthor = invite.authorId == this.state.userId
            if (isAuthor) {
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
            const content = []
            if (isAuthor) {
                content.push(...[
                    elem("span").addChild("You have sent a friend invite to "),
                    elem("span").setProps({class: "text-black font-medium"}).addChild(invite.nickname)
                ])
            } else {
                content.push(...[
                    elem("span").setProps({class: "text-black font-medium"}).addChild(invite.nickname),
                    elem("span").addChild(" has sent you a friend invite")
                ])
            }

            return elem("div")
            .setProps({class: "friend-item w-full select-none flex items-center justify-between gap-4 py-2 px-4 border-1 border-gray-200 rounded-md hover:border-blue-300 transition-all duration-200"})
            .setChild([
                elem("div")
                .setProps({class: "text-gray-700 font-light"})
                .setChild(content),

                elem("div")
                .setProps({class: "friend-item-buttons flex items-center gap-4 opacity-0 transition-all duration-200"})
                .setChild(buttons)
            ])
        })

        return elem('div').setChild(elems)
    }
}