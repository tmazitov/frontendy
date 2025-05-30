import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";

export default class GamesEmptyMessageComponent extends FrontendyComponent {
    componentName: string = 'games-empty-message-component';

    template() {
        return elem('div')
            .setProps({class: "flex flex-col items-center justify-center w-full text-gray-400 h-24"})
            .setChild([
                elem('i')
                .setProps({class: "ti ti-brand-apple-arcade "}),
                'No games found'
            ])
    }
}