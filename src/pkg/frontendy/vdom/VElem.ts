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
        if (!this.props) {
            this.props = props;
            return this;
        }

        Object.keys(props).forEach((key) => {
            this.props[key] = props[key];
        });

        return this;
    }

    getProps() {     
        return this.props;
    }

    setChild(child: Array<any>) {
        const filtered:Array<VElem | VText | Component> = child
            .filter(c => c != null)
            .map(c => {
                if (!(c instanceof VElem )
                    && !(c instanceof VText) 
                    && !(c instanceof Component)) {
                        c = new VText(c.toString());
                }
                return c;
            })
        this.children.push(...filtered);
        return this;
    }

    addChild(child: any) {
        if (!child) {
            return this;
        }

        if (!(child instanceof VElem )
            && !(child instanceof VText) 
            && !(child instanceof Component)) {
            child = new VText(child.toString());
        }
            
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

    $vfor(array:Array<any>, callback:(elem:VElem, item:any) => void) {
        if (!Array.isArray(array)) {
            throw new Error("v-for expects an array");
        }

        return array.map((item) => {
            const newElem = new VElem(this.tag);
            newElem.setProps(this.props);
            callback(newElem, item)
            return newElem;
        });
    }
}

export default VElem;