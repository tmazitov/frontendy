import updateElement from "../vdom/updateElement";
import VElem from "../vdom/VElem";
import { getComponentUniqueName } from "./name";

class FrontendyComponent{
    
    static componentName: string = getComponentUniqueName();
    
    // State

    private oldVNode: VElem | null = null;
    protected el: HTMLElement | Text | null = null;
    protected state: Record<string, any> = {};
    protected props: Record<string, any> = {};

    constructor(props: Record<string, any> = {}){
        this.initProps(props);
        this.initData();
    }

    initData() {
        this.script();
        this.state = this.createState();
    }

    private initProps(props: Record<string, any> = {}) {
        this.props = props
        console.log("Component props : ", this.props);
    }

    protected data(){
        return {};
    }

    print(){
        console.log("Component : ", FrontendyComponent.componentName)
    }

    private createState<T extends object>() : T {

        const initialState = this.data() as T;

        return new Proxy(initialState, {
            set: (target, prop, value) => {
                target[prop as keyof T] = value;
                console.log(`🔄 State обновлен: ${String(prop)} → ${value}`);
                this.update(); // ⬅️ Автоматическое обновление VDOM
                return true;
            }
        });
    }

    protected script(){}

    public template() : VElem | undefined{
        return undefined;
    }

    public onMounted() {}

    public onUnmounted() {}
    
    public render(target: HTMLElement) {
        this.oldVNode = this.template() ?? null;
        if (!this.oldVNode) {
            this.el = null;
            return
        }
        this.el = this.oldVNode.createHTMLElement();
        console.log("Rendered node : ", this.oldVNode)
        target.appendChild(this.el);
        this.onMounted();
        return this.el;
    }
    
    update() {
        console.log("el", this.el)
        if (!this.el) {
            this.render(document.body);
            return;
        }

        const newVNode = this.template();
        if (!newVNode) {
            return;
        }
        console.log(newVNode)
        console.log("New node : ", newVNode)
        console.log("Old node : ", this.oldVNode)
        updateElement(this.el, this.oldVNode, newVNode);
        this.oldVNode = newVNode; // Сохраняем VDOM для следующего сравнения
    }
}

export default FrontendyComponent;