import API from "../../api/api";
import ModalLayout from "../../layouts/modal/ModalLayout";
import router from "../../pages/router";
import EventBroker from "../../pkg/event-broker/eventBroker";
import FrontendyComponent from "../../pkg/frontendy/component/component"
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import Store from "../../store/store";
import ButtonComponent from "../inputs/ButtonComponent";
import InfoParagraphComponent from "../inputs/InfoParagraphComponent";
import InputComponent from "../inputs/InputComponent";

export default class DeleteAccountModal extends FrontendyComponent {
    componentName: string = 'delete-account-modal';

    data() {
        return {
            show: false,
            errorMessage: "",
            originalNickname: undefined,
            enteredNickname: "",
        }
    }
    public setShow(value: boolean) {
        this.state.show = value;
        return this 
    }

    protected onCreated(): void {
        Store.getters.userNickname().then((nickname: string|undefined) => {
            this.state.originalNickname = nickname
        })
    }

    private async onSubmit() {

        try {
            await API.ums.userDelete()
        } catch (error) {
            console.error("Error during account deletion:", error);
            return
        }
        
        await API.ums.signOut()
        
        this.setShow(false)
        router.push("home")
        EventBroker.getInstance().emit("update-auth");
    }

    template() {
        return elem("span")
            .addChild(
                new ModalLayout("delete-account-modal", {
                    onClose: () => this.state.show = false,
                    customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white"
                })
                .setShow(this.state.show)
                .setSlot("header", 
                    elem("h2")
                    .addChild(text("Delete your Account"))
                    .setProps({ class: "text-xl font-bold text-center" }))
                .setSlot("body",
                    elem("div")
                    .setProps({ class: "flex flex-col gap-4" })
                    .setChild([
                        new InfoParagraphComponent("This action cannot be undone."),
                        new InfoParagraphComponent(`To delete your account, please enter "${this.state.originalNickname}" in the field below:`),

                        new InputComponent(this.state.enteredNickname, { placeholder: "Enter your nickname" })
                            .onBlur((value: string) => {
                                console.log("blur", value)
                                this.state.enteredNickname = value
                            })
                            .onEnter((value: string) => {
                                console.log("enter", value)
                                this.state.enteredNickname = value
                            }),

                        new ButtonComponent({
                            label: "Delete",
                            icon: "ti ti-trash",
                            color: "red",
                            isDisabled: this.state.enteredNickname != this.state.originalNickname,
                        }).onClick(() => {
                            this.onSubmit()
                        })
                    ])
                )
            )
    }
}