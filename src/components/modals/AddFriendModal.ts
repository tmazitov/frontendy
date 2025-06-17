import LoadingLayout from "../../layouts/loading/LoadingLayout";
import ModalLayout from "../../layouts/modal/ModalLayout";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem    } from "../../pkg/frontendy/vdom/constructor";
import Store from "../../store/store";
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
            form: {
                nickname: "",
            }
        }
    }

    public setShow(value: boolean) {
        this.state.show = value;
        return this 
    }

    private async onSubmitHandler() {
        const nickname = this.state.form.nickname;
        if (!nickname || nickname.trim() === "") {
            this.state.errorMessage = "Nickname cannot be empty";
            return ;
        }
        this.state.errorMessage = undefined;
        this.state.successMessage = undefined;

        this.state.isLoading = true;
        const err = await Store.setters.sendFriendInvite(nickname)
        this.state.isLoading = false;
        if (err !== undefined) {
            this.state.errorMessage = err;
            return ;
        }
        this.state.successMessage = "Friend invite sent successfully!";
        this.state.form = {nickname: ""}
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
        console.log("messages", this.state.successMessage, this.state.errorMessage);
        const message: string = this.state.errorMessage ?? this.state.successMessage ;
        const messageColor: string = this.state.errorMessage ? 'red' : 'green';
        const body = elem("div")
            .setProps({ class: "flex flex-col gap-4" })
            .setChild([
                new LoadingLayout({
                    label: "Please wait...", 
                    icon: "ti ti-loader"
                }).setShow(this.state.isLoading),
                

                elem("span")
                .setProps({style: `${message ? "display: block;" : "display: none;"}`})
                .setChild([
                    new MessageComponent(message, {color: messageColor}),
                ]),

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