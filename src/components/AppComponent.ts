import NotFoundPage from "../pages/NotFoundPage";
import router from "../pages/router";
import Component from "../pkg/frontendy/component/component";
import FrontendyRouterView from "../pkg/frontendy/router/RouterView";
import { elem, text } from "../pkg/frontendy/vdom/constructor";

export default class AppComponent extends Component {
    
    static componentName: string = 'app-container';
    
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
                    .addChild(text("Hello, from AppComponent!")),
                elem("p")
                    .addChild(text("There will be router below...")),
                elem("a")
                    .setProps({ href: "/home" })
                    .addChild(text("Home")),
                elem("a")
                    .setProps({ href: "/about" })
                    .addChild(text("About")),
                new FrontendyRouterView(router)
            ])
    }   
}