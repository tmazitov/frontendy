import Component from "pkg/internal/component/Component";
import { elem } from "pkg/internal/vdom/constructor";

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

    onMounted() {
        console.log('mounted', this.state.value)
        this.el?.querySelector('input')?.addEventListener('input', (ev:any) => {
            this.state.value = ev.target.value
        })
    }
    
    onUnmounted() {
        this.el?.querySelector('input')?.removeEventListener('input', this.valueInput)
    }

    template() {
        return elem("div")
            .setProps({ id: "app" })
            .setChild([
                elem("h1").addChild("Hello, World!"),
                elem("p").addChild(this.valueLength()),
                elem("p").addChild(this.state.value),
                elem("input").setProps({id: "test", value: this.state.value}),
                elem("button").setProps({ onclick: () => console.log("Hello, World!") }).addChild("Click me!")
            ])
    }   
}