import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import SignInForm from "../../types/forms/signInForm";
import ButtonComponent from "../inputs/ButtonComponent";
import InputComponent from "../inputs/InputComponent";

export default class AuthForm extends FrontendyComponent {
    componentName: string = 'auth-form';

    constructor(form: SignInForm, onSubmit: Function) {
        super({form, onSubmit});
    }

    data() {
        return {
            form: this.props.form,
        }
    }

    submit() {
        this.props.onSubmit(this.state.form);
    }

    onChangePassword(value: string) {
        this.state.form.password = value;
    }

    onChangeEmail(value: string) {
        this.state.form.email = value;
    }

    template() {

        const submitButton = new ButtonComponent({label: "Submit", color: "blue", fullWidth: true })
            .onClick(this.submit.bind(this))
 
        const passwordInput = new InputComponent(this.state.form.password, {
            type: 'password',
            label: 'Password',
        })
        .onInput((value: string) => this.state.form.password = value)
        .onEnter(this.submit.bind(this));

        const emailInput = new InputComponent(this.state.form.email, {
            type: 'email',
            label: 'Email',
        })
        .onInput((value: string) => this.state.form.email = value)
        .onEnter(() => passwordInput.focus())
 
        return elem('div')
            .setProps({ class : "flex flex-col gap-4"})
            .setChild([
                emailInput,
                passwordInput,

                elem("div")
                .setProps({ class : "mt-2 flex"})
                .addChild(submitButton),
            ])
    }
}