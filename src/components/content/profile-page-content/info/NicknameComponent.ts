import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";

export default class NicknameComponent extends FrontendyComponent {
    componentName: string = 'nickname-component';

    constructor(nickname: string) {
        super({nickname});
    }

    template() {
        return elem('h2')
        .setProps({class: "text-xl font-bold"})
        .addChild(`${this.props.nickname}`)   
    }
}