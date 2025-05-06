import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";
import SignUpForm from "../../types/forms/registrationForm";
import ButtonComponent from "../inputs/ButtonComponent";
import InputComponent from "../inputs/InputComponent";

export default class RegistrationForm extends FrontendyComponent {
    componentName: string = 'registration-form';

    constructor(form: SignUpForm, onSubmit: Function) {
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

    onChangeNickname(value: string) {
        this.state.form.nickname = value;
    }

    onChangeEmail(value: string) {
        this.state.form.email = value;
    }

    onChangePassword(value: string) {
        this.state.form.password = value;
    }

    template() {
        const submitButton = new ButtonComponent({label: "Submit", color: "blue", fullWidth: true  })
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
        .onEnter(() => passwordInput.focus());

        const nicknameInput = new InputComponent(this.state.form.nickname, {
            type: 'text',
            label: 'Nickname',
        })
        .onInput((value: string) => this.state.form.nickname = value)
        .onEnter(() => emailInput.focus());
 
        return elem('div')
            .setProps({ class : "flex flex-col gap-4"})
            .setChild([
                nicknameInput,
                emailInput,
                passwordInput,

                elem("div")
                .setProps({ class : "mt-2 flex"})
                .addChild(submitButton),
            ])
    }
} 