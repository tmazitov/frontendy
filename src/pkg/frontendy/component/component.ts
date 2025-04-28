import updateElement from "../vdom/updateElement";
import VElem from "../vdom/VElem";
import VText from "../vdom/VText";
import FrontendyLifecicle from "./lifecicle";
import { getComponentUniqueName } from "./name";
import FrontendySlot from "./slot";

class FrontendyComponent extends FrontendyLifecicle{
    
    public componentName: string = getComponentUniqueName();
    
    // State
    
    protected state: Record<string, any> = {};
    private _props: Record<string, any> = {};
    private _slots: Record<string, FrontendySlot > = {};

    // VDOM

    private oldVNode: VElem | null = null;
    private isMounted: boolean = false;
    private _el: HTMLElement | Text | null = null;

    constructor(props: Record<string, any> = {}){
        super();
        this.initProps(props);
        this.initState();
        this.initSlots();
        this.onCreated();
    }

    private initProps(props: Record<string, any> = {}) {
        this._props = props
    }

    private initState<T extends object>() {
        const initialState = this.data() as T;
        
        this.state = new Proxy(initialState, {
            set: (target, prop, value) => {
                target[prop as keyof T] = value;
                console.log(`🔄 State обновлен: ${String(prop)} → ${value}`);
                this.update(); // ⬅️ Автоматическое обновление VDOM
                return true;
            }
        });
    }

    private initSlots() {
        this.slots().forEach((slotName) => {
            this.registerSlot(slotName);
        })
    }

    protected get props() {
        return this._props
    }

    protected get el() {
        return this._el
    }
    
    protected data(){
        return {};
    }

    protected slots() : Array<string>{
        return []
    }

    public print(){
        console.log("Component : ", this.componentName)
    }

    protected template() : VElem | undefined{
        return undefined;
    }
    
    public mount(target: HTMLElement) {
        this.oldVNode = this.template() ?? null;
        
        if (!this.oldVNode) {
            this._el = null;
            return
        }
        this._el = this.oldVNode.createHTMLElement();
        target.appendChild(this._el);
        if (!this.isMounted) {
            this.onMounted();
        } else {
            this.onUpdated();
        }
        this.isMounted = true;
        return this.el;
    }

    public unmount() {
        if (!this.el || !this.isMounted) {
            return
        }

        const parent = this.el.parentElement
        if (parent) {
            parent.removeChild(this.el);
        }
        this._el = null;
        this.oldVNode = null;
        this.isMounted = false;
        this.onUnmounted();
    }

    
    public update() {
        if (!this.isMounted || !this.el) {
            return;
        }

        const newVNode = this.template();
        if (!newVNode) {
            return;
        }
        updateElement(this.el, this.oldVNode, newVNode);
        this.oldVNode = newVNode; // Сохраняем VDOM для следующего сравнения
    }
    
    private registerSlot(name: string) {
        if (this._slots[name]) {
            return this._slots[name];            
        }
        
        const slot = new FrontendySlot(name);
        this._slots[name] = slot;
        return slot;
    }

    protected useSlot(name: string) : FrontendyComponent | VElem | VText | null {
        if (!this._slots[name]) {
            throw new Error(`FrontendyComponent error : slot with name "${name}" does not exist`);
        }
        return this._slots[name].render();
    }

    public setSlot(name: string, value: FrontendyComponent | VElem | VText): FrontendyComponent {
        if (!this._slots[name]) {
            throw new Error(`FrontendyComponent error : slot with name "${name}" does not exist`);
        }
        this._slots[name].set(value);
        return this
    }
}

export default FrontendyComponent;