import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import DelimeterComponent from "./DelimeterComponet";
import PaddleComponent from "./PaddleComponent";

export default class SceneComponent extends FrontendyComponent {
    componentName: string = 'scene-component';

    data() {
        return {}
    }

    template() {
        return elem('div')
            .setProps({ class: "p-[16px] w-[512px] h-[320px] relative bg-gray-100 rounded-lg shadow-md" })
            .setChild([
                new DelimeterComponent(),
                new PaddleComponent({ top: 20, side: 'left' }),
                new PaddleComponent({ top: 20, side: 'right' }),
            ])
    }
}