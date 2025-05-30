import LoadingLayout from "../../layouts/loading/LoadingLayout";
import ModalLayout from "../../layouts/modal/ModalLayout";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import User from "../../types/User";
import ButtonComponent from "../inputs/ButtonComponent";
import InfoParagraphComponent from "../inputs/InfoParagraphComponent";

export default class DeleteFriendModal extends FrontendyComponent {
    componentName: string = 'delete-friend-modal';

    constructor(friend: User | undefined) {
        super({ friend })
    }

    data() {
        return {
            show: false,
            isLoading: false,
            onSubmitCallback: undefined,            
        }
    }

    public onSubmit(fn:Function) {
        this.state.onSubmitCallback = fn;
        return this;
    }

    public setShow(value: boolean) {
        this.state.show = value;
        return this 
    }

    private onSubmitHandler() {
        this.state.isLoading = true;
        setTimeout(() => {
            this.state.isLoading = false;
            this.state.onSubmitCallback?.()
            this.setShow(false);
        }, 1000)
    }
    template() {

        const friendsNickname = this.props.friend?.nickname || "Friend";

        // Header
        const header = elem("h2")
            .setProps({ class: "text-lg font-semibold text-gray-800" })
            .addChild(`Delete friend ${friendsNickname}?`);

        // Body
        const body = elem("div")
            .setProps({ class: "flex flex-col gap-4" })
            .setChild([
                new LoadingLayout({
                    label: "Please wait...", 
                    icon: "ti ti-loader"
                }).setShow(this.state.isLoading),

                new InfoParagraphComponent(`Are you sure you want to delete user with nickname "${friendsNickname}" from your friend list?`),
                
                elem("div")
                .setProps({ class: "flex gap-2 justify-between" })
                .setChild([
                    new ButtonComponent({
                        label: "Cancel",
                        color: "blue",
                        type: "default",
                    }).onClick(() => this.setShow(false)),
                    new ButtonComponent({
                        label: "Delete",
                        color: "red",
                        type: "outline",
                    }).onClick(() => this.onSubmitHandler())
                ])
            ])

        return elem('span').addChild(
            new ModalLayout("game-launch-modal", {
                customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white",
                closeOnClickOutside: true,
            })
            .setShow(this.state.show)
            .setSlot("body", body)
            .setSlot("header", header)
        )
    }
}