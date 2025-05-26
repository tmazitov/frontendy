import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";

export default class InProccessMessageComponent extends FrontendyComponent {
    componentName: string = 'in-proccess-message-component';

    data() {
        return {}
    }

    template() {
        return elem('div')
        .setProps({ class: "rounded-lg overflow-hidden shadow-md gap-2 bg-white p-6  max-w-2xl w-full flex flex-col items-center" })
        .setChild([
            elem('i')
            .setProps({ class: "ti ti-loader loading text-xl text-blue-500"}),

            elem('h1')
            .setProps({ class: "text-2xl font-bold" })
            .addChild('Authorizing...'),

            elem('div')
            .setChild([
                elem('p')
                .setProps({ class: "text-md text-center" })
                .addChild('Please wait until the authorization process is completed.'),

                elem('p')
                .setProps({ class: "text-md text-center" })
                .addChild('This may take a few seconds.'),
            ])
        ])
    }
}