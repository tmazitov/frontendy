import { elem, text } from "../../pkg/internal/vdom/constructor";
import Component from "../../pkg/internal/component/Component";

export default class Counter extends Component {
    
    static name: string = 'counter-button';
    

    data() {
        return {
            count: 0,
        }
    }
    increment() {
        this.state.count++;
    }
    getStyles() {
        if (this.state.count < 2) {
            return "background: red";
        } else if (this.state.count < 5) {
            return "background: yellow";
        }
        return "background: green";
    }

    template() {
        return elem("div")
        .setProps({ id: "counter" })
        .setChild([
            elem("p").addChild(text(`${this.state.count}`)),
            elem("button")
                .setProps({ id: "increment", style: this.getStyles()})
                .addChild(text("Increment!"))
                .addEventListener("click", () => {
                    this.increment();
                }),
        ])
    }
}