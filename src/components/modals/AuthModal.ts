import ModalLayout from "../../layout/modal/ModalLayout";
import FrontendyComponent from "../../pkg/frontendy/component/component"
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import AuthForm from "../forms/AuthForm";

export default class AuthModal extends FrontendyComponent {

    constructor() {
        super();
    }
    
    data() {
        return {
            show: false,
        }
    }
    public setShow(value: boolean) {
        this.state.show = value;
        return this 
    }

    template() {
        return elem("span")
            .addChild(
                new ModalLayout("auth-modal", {
                    onClose: () => this.state.show = false,
                })
                .setShow(this.state.show)
                .setSlot("header", 
                    elem("h2")
                    .addChild(text("Sign in"))
                    .setProps({ class: "text-xl font-bold text-center" }))
                .setSlot("body",
                    new AuthForm()))
    }
}