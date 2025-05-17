import ModalLayout from "../../layout/modal/ModalLayout";
import FrontendyComponent from "../../pkg/frontendy/component/component"
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import ButtonComponent from "../inputs/ButtonComponent";
import InfoParagraphComponent from "../inputs/InfoParagraphComponent";
import InputComponent from "../inputs/InputComponent";

export default class DeleteAccountModal extends FrontendyComponent {
    componentName: string = 'delete-account-modal';

    data() {
        return {
            show: false,
            errorMessage: "",
            originalNickname: "tmazitov",
            enteredNickname: "",
        }
    }
    public setShow(value: boolean) {
        this.state.show = value;
        return this 
    }

    private onSubmit() {
        this.setShow(false)
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