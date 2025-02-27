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

class Component extends HTMLElement{
    
    static name: string = getComponentUniqueName();;
    static components: typeof Component[] = []
    static methods: { [key: string]: Function } = {};
    
    // State

    private oldVNode: VElem | null = null;
    protected state: Record<string, any>;

    constructor(){
        super();
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

    public connectedCallback(){
        console.log(`lifecycle | ${Component.name} connected`)
        this.render();
    }

    public disconnectedCallback(){
        console.log(`lifecycle | ${Component.name} disconnected`)
        this.onUnmounted();
    }

    public onMounted() {}

    public onUnmounted() {}
    
    createReactiveState<T extends object>(initialState: T): T {
        return new Proxy(initialState, {
        set: (target, prop, value) => {
            target[prop as keyof T] = value;
            this.update(); // ⬅️ Автоматическое обновление VDOM
            return true;
        }
        });
    }
    
    
    renderVDOM(): VElem | undefined {
        return this.template();
    }
    
    public render(target: HTMLElement = this) {
        this.oldVNode = this.renderVDOM() ?? null;
        if (!this.oldVNode) {
            return
        }
        target.appendChild(this.oldVNode.createHTMLElement());
        setTimeout(() => this.onMounted(), 100)
    }
    
    update() {
        const newVNode = this.renderVDOM();
        if (!newVNode) {
            return;
        }
        updateElement(this, this.oldVNode, newVNode);
        this.oldVNode = newVNode; // Сохраняем VDOM для следующего сравнения
    }
}

export default Component;