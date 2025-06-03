import LoadingLayout from "../../layouts/loading/LoadingLayout";
import ModalLayout from "../../layouts/modal/ModalLayout";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem    } from "../../pkg/frontendy/vdom/constructor";
import ButtonComponent from "../inputs/ButtonComponent";
import InputComponent from "../inputs/InputComponent";
import MessageComponent from "../inputs/MessageComponent";

export default class AddFriendModal extends FrontendyComponent {
    componentName: string = 'add-friend-modal';

    data() {
        return {
            show: false,
            isLoading: false,
            errorMessage: undefined,
            successMessage: undefined,
            onSubmitCallback: undefined,
            form: {
                nickname: "",
            }
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
            this.state.onSubmitCallback?.(this.state.form.nickname)
            this.state.form = {nickname: ""}
            this.setShow(false);
        }, 1000)
    }
    template() {

        const submitButton = new ButtonComponent({
            label: "Add Friend",
            color: "blue",
        }).onClick(() => this.onSubmitHandler());

        const input = new InputComponent(this.state.form.nickname, {
            label: "Friend's Nickname",
        }).onInput((value: string) => this.state.form.nickname = value)
        .onEnter(() => this.onSubmitHandler())

        // Header
        const header = elem("h2")
            .setProps({ class: "text-lg font-semibold text-gray-800" })
            // .addChild(new ButtonComponent({icon: "ti ti-x", color: "gray", type: "blank"}).onClick(() => this.setShow(false)))
            .addChild(`New friend`);

        // Body
        const body = elem("div")
            .setProps({ class: "flex flex-col gap-4" })
            .setChild([
                new LoadingLayout({
                    label: "Please wait...", 
                    icon: "ti ti-loader"
                }).setShow(this.state.isLoading),

                new MessageComponent(this.state.errorMessage, {color: 'red'}),
                new MessageComponent(this.state.errorMessage, {color: 'green'}),

                input,
                submitButton,
            ])

        return elem('span').addChild(
            new ModalLayout("game-launch-modal", {
                customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white",
                closeOnClickOutside: true,
                onClose: () => this.setShow(false),
            })
            .setShow(this.state.show)
            .setSlot("body", body)
            .setSlot("header", header)
        )
    }
}