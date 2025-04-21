import Component from "../component/component";
import createElement from "./createElement";
import VText from "./VText";

class VElem{
    public tag:string;
    public props:Record<string, any> = {};
    public children:(VElem | VText | Component)[] = [];
    public show:boolean = true;
    public styles:Record<string, any> = {};
    public events:Record<string, EventListener> = {};

    constructor(tag:string) {
        this.tag = tag;
    }

    setProps(props:Record<string, any>) {
        this.props = props;
        return this;
    }

    getProps() {     
        return this.props;
    }

    setChild(child: Array<VElem | VText | Component | null>) {
        const filtered:Array<VElem | VText | Component> = child.filter(c => c != null)
        this.children.push(...filtered);
        return this;
    }

    addChild(child: VElem | VText) {
        this.children.push(child);
        return this;
    }
    
    addEventListener(event:string, callback:EventListener) {
        if (!event || !callback) {
            throw new Error("event and callback are required");
        }
        this.events[event] = callback;
        return this;
    }
    
    createHTMLElement(): HTMLElement | Text {
        return createElement(this);
    }

    print(level:number=0){
        const props = Object.keys(this.props).map((key) => `${key}="${this.props[key]}"`)

        console.log(`${"-".repeat(level)}> ${this.tag} with ${props}`)
        this.children.forEach((child) => {
            child.print(level + 2)
        })
    }


    $vif(conditionResult:boolean) {
        
        if (!conditionResult) {
            this.styles.display = 'none';
        } else {
            this.styles.display = null;
        }

        return this
    }
}

export default VElem;