import { AxiosError, AxiosResponse } from "axios";
import API from "../../api/api";
import ModalLayout from "../../layouts/modal/ModalLayout";
import EventBroker from "../../pkg/event-broker/eventBroker";
import FrontendyComponent from "../../pkg/frontendy/component/component"
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import SignUpForm from "../../types/forms/registrationForm";
import SignInForm from "../../types/forms/signInForm";
import AuthForm from "../forms/AuthForm";
import RegistrationForm from "../forms/RegistrationForm";
import Store from "../../store/store";
import ButtonComponent from "../inputs/ButtonComponent";
import OtpForm from "../forms/OtpForm";
import GoogleOAuth from "../../api/oauth/google";
import Config from "../../config";

export default class AuthModal extends FrontendyComponent {

    constructor() {
        super();
    }
    
    data() {
        return {
            show: false,
            isLogin: true,
            isOtpCode: false,
            errorMessage: "",
            otpKey: undefined,
            signInForm: new SignInForm("", ""),
            signUpForm: new SignUpForm("", "", ""),
        }
    }
    public setShow(value: boolean) {
        this.state.show = value;
        return this 
    }

    async onSubmitForm(form: SignInForm | SignUpForm) {
        console.log('form :>> ', form);
        const error = form.validate();
        if (error) {
            this.state.errorMessage = error;
            return;
        }

        this.state.errorMessage = "";

        try {
            let response:AxiosResponse|null = null;
            if (this.state.isLogin && form instanceof SignInForm) {
                response = await API.ums.signIn(form);
            } else if (!this.state.isLogin && form instanceof SignUpForm) {
                response = await API.ums.signUp(form);
            } else {
                throw new Error("invalid form type");
            }
            
            if (response === null) {
                throw new Error("no received response from server");
            }

            const data = response.data;
            this.state.otpKey = data.key;

        } catch (error: any) {
            if (error instanceof AxiosError) {
                this.state.errorMessage = this.serverResponseMessage(error.status);
            } else {
                console.error("AuthModal error :", error);
            }
            return;
        }


        
        this.state.isOtpCode = true;
    }

    async onSubmitOtp(code: string) {

        try{
            await API.ums.veryfyOtpCode(code, this.state.otpKey as string);
            Store.setters.setupUser()
            EventBroker.getInstance().emit("update-auth");
            this.setShow(false);
        } catch (error: any) {
            if (error instanceof AxiosError) {
                this.state.errorMessage = this.serverResponseMessage(error.status);
            } else {
                console.error("AuthModal error :", error);
            }
            return;
        }

    }

    async signInWithGoogle() {
        GoogleOAuth.redirectToGoogle(Config.googleOauthClientId, Config.googleOauthRedirectUri)
    }

    serverResponseMessage(status?:number) {
        switch (status) {
            case 400:
                return "Validation error. Please check your input.";
            case 401:
                return "Invalid credentials. Please try again.";
            case 409:
                return "User with this login or email already exists.";
            case 500:
                return "Internal server error. Please try again later.";
            default:
                return "Unknown error";
        }
    }

    toggleForm() {
        this.state.isLogin = !this.state.isLogin;
        this.state.errorMessage = "";
    }

    getAppropriateForm() {
        if (this.state.isOtpCode) {
            return new OtpForm(this.onSubmitOtp.bind(this));
        }

        return this.state.isLogin ?
            new AuthForm(this.state.signInForm, this.onSubmitForm.bind(this)) : 
            new RegistrationForm(this.state.signUpForm, this.onSubmitForm.bind(this))
    }

    getAppropriateTitle() {
        if (this.state.isOtpCode) {
            return "Verification code";
        }

        return this.state.isLogin ? "Sign in" : "Sign up"
    }

    template() {
        const form = this.getAppropriateForm()
        const title = this.getAppropriateTitle();

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
                    .addChild(title)
                    .setProps({ class: "text-xl font-bold text-center" }))
                .setSlot("body",
                    elem("div")
                    .setProps({ class: "flex flex-col gap-4" })
                    .setChild([
                        elem("div").$vif(this.state.errorMessage)
                            .setProps({ class: "text-red-500 text-sm text-center" })
                            .addChild(this.state.errorMessage),

                        form,


                        elem("div").$vif(!this.state.isOtpCode)
                        .setProps({ class: "flex flex-col gap-2 justify-center" })
                        .setChild([
                        
                            new ButtonComponent({
                                label: "Proceed with Google",
                                color: "blue",
                                icon: "ti ti-brand-google",
                                type: "outline",
                                // isDisabled: true,
                            }).onClick(() => this.signInWithGoogle()),
                        
                            elem("button")
                            .setProps({ 
                                class: "text-blue-500 hover:text-blue-700 underline text-sm",
                            })
                            .addChild(toggleText)
                            .addEventListener("click", this.toggleForm.bind(this))
                        ])
                    ])
                )
            )
    }
}