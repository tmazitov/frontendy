import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";

export default class PlayerBoxComponent extends FrontendyComponent {
    componentName: string = 'player-box-component';

    constructor(status: string) {
        super({status})
    }   

    getBackgroundColor(status: string) {
        switch (status) {
            case "confirmed":
                return "bg-green-500";
            case "waiting":
                return "bg-gray-300";
            case "missing":
                return "bg-red-500";
            default:
                return "bg-gray-300";
        }
    }

    getBorderColor(status: string) {
        switch (status) {
            case "confirmed":
                return "border-green-500";
            case "waiting":
                return "border-gray-300";
            case "missing":
                return "border-red-500";
            default:
                return "border-gray-300";
        }
    }

    template() {

        const status = this.props.status
        
        const borderColor = this.getBorderColor(status);
        const bgColor = this.getBackgroundColor(status);

        return elem('div')
            .setProps({class : `w-8 h-8 border-2 ${borderColor} ${bgColor} rounded-md flex justify-center items-center`})
    }
}