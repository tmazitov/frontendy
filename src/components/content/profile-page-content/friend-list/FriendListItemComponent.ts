import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";
import User from "../../../../types/User";
import ButtonComponent from "../../../inputs/ButtonComponent";
import SmallAvatarComponent from "../../../inputs/SmallAvatarComponent";
import TagComponent from "../../../inputs/TagComponent";
import FriendListItemNameComponent from "./FriendListItemNameComponent";

export default class FriendListItemComponent extends FrontendyComponent {
    componentName: string = 'frient-list-item-componet';

    constructor(user:User) {
        super({user})
    }

    protected data(): {} {
        return {
            onDeleteCallback: undefined,
        }
    }

    public onDelete(fn:Function) {
        this.state.onDeleteCallback = fn;
        return this;
    }

    private onDeleteHandler() {
        this.state.onDeleteCallback?.();
    }

    template() {
        return elem('div')
            .setProps({class : "friend-item flex gap-4 items-center border-1 border-gray-200 py-2 px-4 cursor-default rounded-md select-none"})
            .setChild([

                // Main info
                elem('div')
                .setProps({class: "flex gap-4 items-center"})
                .setChild([
                    new SmallAvatarComponent({
                        imagePath: this.props.user.avatarUrl,
                    }),
    
                    new TagComponent({
                        label: !this.props.user?.isOnline ?
                            'Offline' : 'Online',
                        color: !this.props.user?.isOnline ? 
                            'gray' : 'green'
                    }),
    
                    new FriendListItemNameComponent(this.props.user.nickname, this.props.user.id),

                    elem("p")
                    .setProps({class: "text-gray-500 text-sm"})

                    // .addChild(`MMR: ${this.props.user.rating}`),
                ]),


                // Buttons
                elem('div')
                .setProps({class: "friend-item-buttons flex gap-2 items-center ml-auto opacity-0 transition-all duration-200"})
                .setChild([
                    new ButtonComponent({
                        icon: "ti ti-device-gamepad",
                        color: "green",
                        type: "outline",
                        size: "small",
                        isDisabled: true,
                    }).onClick(() => {}),

                    new ButtonComponent({
                        icon: "ti ti-minus",
                        color: "red",
                        type: "outline",
                        size: "small",
                    }).onClick(() => this.onDeleteHandler()),
            ])
        ])
    }
}