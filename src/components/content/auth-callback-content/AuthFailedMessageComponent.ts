import router from "../../../pages/router";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import ButtonComponent from "../../inputs/ButtonComponent";

export default class AuthFailedMessageComponent extends FrontendyComponent {
    componentName: string = 'auth-failed-message-component';

    data() {
        return {}
    }

    template() {
        return elem('div')
        .setProps({ class: "rounded-lg overflow-hidden shadow-md gap-2 bg-white p-6  max-w-2xl w-full flex flex-col items-center" })
        .setChild([
            elem('i')
            .setProps({ class: "ti ti-bug text-xl text-red-500"}),

            elem('h1')
            .setProps({ class: "text-2xl font-bold" })
            .addChild('Authorization Failed'),

            elem('div')
            .setChild([
                elem('p')
                .setProps({ class: "text-md text-center" })
                .addChild('An error occurred during the authorization process.'),
            ]),

            new ButtonComponent({
                label: 'Home',
                color: 'blue',
            }).onClick(() => router.push('home')) 
        ])
    }
}