import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";

export default class WaitPlayerBoxComponent extends FrontendyComponent {
    componentName: string = 'wait-player-box-component';

    constructor(isConfirmed: boolean) {
        super({isConfirmed})
    }   

    template() {

        const borderColor = this.props.isConfirmed ? "border-green-500" : "border-gray-300";
        const bgColor = this.props.isConfirmed ? "bg-green-500" : "bg-gray-300";

        return elem('div')
            .setProps({class : `w-8 h-8 border-2 ${borderColor} ${bgColor} rounded-md flex justify-center items-center`})
    }
}