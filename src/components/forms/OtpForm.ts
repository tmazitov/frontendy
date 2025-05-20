import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";
import InfoParagraphComponent from "../inputs/InfoParagraphComponent";
import InputComponent from "../inputs/InputComponent";

export default class OtpForm extends FrontendyComponent {
    componentName: string = 'otp-form';

    constructor(onSubmit: Function) {
        super({onSubmit});
    }

    data() {
        return {
            code: ["","","","","",""],
        }
    }

    template() {

        const inputs = this.state.code.map((value: string, index: number) => {
            return new InputComponent(value, {length: 1})
            .onInput((newValue: string) => {
                if (newValue.length > 0 && index != 5) {
                    inputs[index + 1].focus();
                } else if (newValue.length == 0 && index != 0) {
                    inputs[index - 1].focus();
                }
                this.state.code[index] = newValue;
                if (this.state.code.join("").length == 6) {
                    this.props.onSubmit(this.state.code.join(""));
                }
            })
        })

        return elem('div')
            .setChild([

                new InfoParagraphComponent("Enter the verification code sent to your email."),

                elem('div')
                .setProps({class: "flex gap-4 p-4"})
                .setChild([
                    ...inputs,
                ])
            ])
    }
}