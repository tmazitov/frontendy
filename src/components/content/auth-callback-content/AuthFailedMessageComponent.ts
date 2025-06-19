import router from "../../../pages/router";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import ButtonComponent from "../../inputs/ButtonComponent";

export default class AuthFailedMessageComponent extends FrontendyComponent {
    componentName: string = 'auth-failed-message-component';

    constructor(error: {message:string, status:number}) {
        super({error})
    }

    private appropriateIcon(){
        const status = this.props.error.status;
        switch (status) {
            case 400:
                return 'ti ti-alert-triangle text-yellow-500';
            case 409:
                return 'ti ti-mailbox text-gray-500';
            case 404:
                return 'ti ti-exclamation-mark text-yellow-500';
            default:
                return 'ti ti-bug text-red-500'; // Default icon for unknown errors
        }
    }

    template() {
        const icon = this.appropriateIcon();

        return elem('div')
        .setProps({ class: "rounded-lg overflow-hidden shadow-md gap-2 bg-white p-6  max-w-2xl w-full flex flex-col items-center" })
        .setChild([
            elem('i')
            .setProps({ class: `${icon} text-4xl`}),

            elem('h1')
            .setProps({ class: "text-2xl font-bold" })
            .addChild('Oops, something went wrong!'),

            elem('div')
            .setChild([
                elem('p')
                .setProps({ class: "text-md text-center" })
                .addChild(this.props.error.message),
            ]),

            new ButtonComponent({
                label: 'Home',
                color: 'blue',
            }).onClick(() => router.push('home')) 
        ])
    }
}