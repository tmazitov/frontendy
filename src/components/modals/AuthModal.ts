import ModalLayout from "../../layout/modal/ModalLayout";
import FrontendyComponent from "../../pkg/frontendy/component/component"
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import SignUpForm from "../../types/forms/registrationForm";
import SignInForm from "../../types/forms/signInForm";
import AuthForm from "../forms/AuthForm";
import RegistrationForm from "../forms/RegistrationForm";

export default class AuthModal extends FrontendyComponent {

    constructor() {
        super();
    }
    
    data() {
        return {
            show: false,
            isLogin: true,
            errorMessage: "",
            signInForm: new SignInForm("", ""),
            signUpForm: new SignUpForm("", "", ""),
        }
    }
    public setShow(value: boolean) {
        this.state.show = value;
        return this 
    }

    onSubmit(form: SignInForm | SignUpForm) {
        const error = form.validate();
        if (error) {
            this.state.errorMessage = error;
            return;
        }
        this.state.errorMessage = "";
        console.log(form);
    }

    toggleForm() {
        this.state.isLogin = !this.state.isLogin;
        this.state.errorMessage = "";
    }

    template() {
        const form = this.state.isLogin ? 
            new AuthForm(this.state.signInForm, this.onSubmit.bind(this)) : 
            new RegistrationForm(this.state.signUpForm, this.onSubmit.bind(this));
            
        const title = this.state.isLogin ? "Sign in" : "Sign up";
        const toggleText = this.state.isLogin 
            ? "Don't have an account? Sign up" 
            : "Already have an account? Sign in";

        return elem("span")
            .addChild(
                new ModalLayout("auth-modal", {
                    onClose: () => this.state.show = false,
                    customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white"
                })
                .setShow(this.state.show)
                .setSlot("header", 
                    elem("h2")
                    .addChild(text(title))
                    .setProps({ class: "text-xl font-bold text-center" }))
                .setSlot("body",
                    elem("div")
                    .setProps({ class: "flex flex-col gap-4" })
                    .setChild([
                        elem("div").$vif(this.state.errorMessage)
                            .setProps({ class: "text-red-500 text-sm text-center" })
                            .addChild(text(this.state.errorMessage)),
                        form,
                        elem("div")
                        .setProps({ class: "text-center mt-2" })
                        .addChild(
                            elem("button")
                            .setProps({ 
                                class: "text-blue-500 hover:text-blue-700 underline text-sm",
                            })
                            .addChild(text(toggleText))
                            .addEventListener("click", this.toggleForm.bind(this))
                        )
                    ])
                )
            )
    }
}