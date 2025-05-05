import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";

export default class InfoContentComponent extends FrontendyComponent {
    componentName: string = 'info-content';

    data() {
        return {}
    }

    template() {
        return elem('tr').setChild([
            elem('td').addChild(text('2023-03-01')),
            elem('td').addChild(text('Ranked')),
            elem('td').addChild(text('Win')),
        ])
    }
}