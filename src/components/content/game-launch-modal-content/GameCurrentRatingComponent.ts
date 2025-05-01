import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";

export default class GameCurrentRatingComponent extends FrontendyComponent {
    componentName: string = 'game-current-rating-component';

    constructor(rating: number) {
        super({rating})
    }
    
    template() {
        return elem("p").$vif(this.props.rating)
            .setProps({ class: "text-sm text-gray-500 mt-6 mb-2"})
            .addChild(text(`Your rating : ${this.props.rating}`))
    }
}