import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";
import MessageComponent from "../../../inputs/MessageComponent";

export default class ListEmptyComponent extends FrontendyComponent {
    componentName: string = 'list-empty-component';

    template() {
        return elem('div')
            .setProps({class: "flex flex-col items-center justify-center h-64 w-full"})
            .setChild([
                new MessageComponent("Friend list is empty. You can add one below.", {color: "gray"})
            ])
    }
}