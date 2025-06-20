import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem } from "../../../../pkg/frontendy/vdom/constructor";
import BigAvatarComponent from "../../../inputs/BigAvatarComponent";

export default class AvatarComponent extends FrontendyComponent {
    componentName: string = 'avatar-component';

    constructor(imagePath:string) {
        super({imagePath});
    }

    template() {
        return elem('div')
            .addChild(new BigAvatarComponent(this.props.imagePath))
    }
}