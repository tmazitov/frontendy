import { elem } from "../vdom/constructor";
import updateElement from "../vdom/updateElement";
import VElem from "../vdom/VElem";

function getCounter(){
    let count = 0;
    return {
        getValue: () => ++count
    }
}

const counter = getCounter();

function getComponentUniqueName(){
    
    const id = counter.getValue()
    
    return "component-" + id;
}

class Component{
    
    static name: string = getComponentUniqueName();;
    static components: typeof Component[] = []
    static methods: { [key: string]: Function } = {};
    
    // State

    private oldVNode: VElem | null = null;
    protected el: HTMLElement | Text | null = null;
    protected state: Record<string, any>;

    constructor(){
        this.state = this.createState();
    }

    protected data(){
        return {};
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
    }
    
    update() {
        if (!this.el) {
            this.render(document.body);
            return;
        }

        const newVNode = this.template();
        if (!newVNode) {
            return;
        }
        console.log(newVNode)
        console.log("New node : ")
        newVNode.print()
        console.log("Old node : ")
        this.oldVNode?.print()
        updateElement(this.el, this.oldVNode, newVNode);
        this.oldVNode = newVNode; // Сохраняем VDOM для следующего сравнения
    }
}

export default Component;