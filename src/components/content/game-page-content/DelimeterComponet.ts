import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";

export default class DelimeterComponent extends FrontendyComponent {
    componentName: string = 'delimeter-component';

    template() {
        return elem('div')
            .setProps({ class: "w-[1px] bg-gray-300 absolute top-[16px] bottom-[16px] left-1/2 transform -translate-x-1/2" })
    }
}