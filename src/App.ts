import Component from "../pkg/internal/component/Component";
import { elem, text } from "../pkg/internal/vdom/constructor";
import Counter from "./components/Counter";

export default class App extends Component {
    
    static name: string = 'app-container';
    
    data() {
        return {
            value: "value",
        }
    }

    valueLength(){
        return `${this.state.value.length}` 
    }

    valueInput(ev:any){
        console.log('valueInput', this)
    }

    factCheck(){
        console.log('factCheck', this.state.value)
        return this.state.value.length > 10
    }

    onMounted() {
        if (!this.el || this.el instanceof Text) 
            return

        console.log('mounted', this.state.value)
        this.el.querySelector('input')?.addEventListener('input', (ev:any) => {
            this.state.value = ev.target.value
        })
    }
    
    onUnmounted() {
        if (!this.el || this.el instanceof Text) 
            return

        this.el.querySelector('input')?.removeEventListener('input', this.valueInput)
    }

    template() {
        return elem("div")
            .setProps({ id: "app" })
            .setChild([
                elem("h1")
                    .addChild(text("Hello, World!")),
                elem("p")
                    .addChild(text(this.valueLength())),
                elem("p")
                    .setChild([
                        text(`Brother : ${this.state.value}`),
                        elem("br"),
                        text(`Sister : ${this.state.value}`),
                    ]),
                elem("input")
                    .setProps({id: "test", value: this.state.value}),
                elem("button")
                    .setProps({ onclick: () => console.log("Hello, World!") })
                    .addChild(text("Click me!")),
                (new Counter())
            ])
    }   
}