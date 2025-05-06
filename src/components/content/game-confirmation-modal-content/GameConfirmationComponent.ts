import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import ButtonComponent from "../../inputs/ButtonComponent";

export default class GameConfirmationComponent extends FrontendyComponent {
    componentName: string = 'confirm-view-component';

    constructor(remainingTime:string, onSubmit:Function) {
        super({onSubmit, remainingTime})
    }

    template() {
        return elem('div')
            .setProps({class : "w-full h-full"})
            .setChild([
                elem('p')
                .setProps({class : "text-sm text-gray-600 mb-2 text-start"})
                .addChild(text(`Confirmation time : ${this.props.remainingTime}`)),

                new ButtonComponent({
                    label: "Accept",
                    color: "blue",
                    fullWidth: true,
                })
                .onClick(this.props.onSubmit.bind(this)),
            ])
    }
}