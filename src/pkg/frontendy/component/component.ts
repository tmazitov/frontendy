import updateElement from "../vdom/updateElement";
import VElem from "../vdom/VElem";
import { getComponentUniqueName } from "./name";

class FrontendyComponent{
    
    public componentName: string = getComponentUniqueName();
    
    // State

    private oldVNode: VElem | null = null;
    private isMounted: boolean = false;
    protected el: HTMLElement | Text | null = null;
    protected state: Record<string, any> = {};
    protected props: Record<string, any> = {};

    constructor(props: Record<string, any> = {}){
        this.initProps(props);
        this.initData();
    }

    private initData() {
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
        console.log("Component : ", this.componentName)
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

    protected template() : VElem | undefined{
        return undefined;
    }

    protected onMounted() {}
    
    protected onUpdated() {}

    protected onUnmounted() {}
    
    public mount(target: HTMLElement) {
        this.oldVNode = this.template() ?? null;
        
        if (!this.oldVNode) {
            this.el = null;
            return
        }
        this.el = this.oldVNode.createHTMLElement();
        console.log(`Rendered node : ${this.componentName}`, this.oldVNode)
        target.appendChild(this.el);
        console.log("Rendered node elem : ", this.el)
        if (!this.isMounted) {
            this.onMounted();
        } else {
            this.onUpdated();
        }
        this.isMounted = true;
        return this.el;
    }

    public unmount() {
        console.log("Unmount component : ", this.componentName)
        console.log("Unmount state : isMounted", this.isMounted)
        console.log("Unmount state : el", this.el)
        if (!this.el || !this.isMounted) {
            return
        }

        const parent = this.el.parentElement
        if (parent) {
            parent.removeChild(this.el);
        }
        this.el = null;
        this.oldVNode = null;
        this.isMounted = false;
        this.onUnmounted();
    }

    
    public update() {
        console.log("Update component : ", this.componentName)
        console.log("Update state : isMounted", this.isMounted)
        console.log("Update state : el", this.el)
        if (!this.isMounted || !this.el) {
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
    
    public getIsMounted() {
        return this.isMounted;
    }
}

export default FrontendyComponent;