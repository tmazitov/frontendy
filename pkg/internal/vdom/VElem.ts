import createElement from "./createElement";
import VText from "./VText";

class VElem{
    public tag:string;
    public props:Record<string, any> = {};
    public children:(VElem | VText)[] = [];
    public show:boolean = true;
    public styles:Record<string, any> = {};

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

    setChild(child: Array<VElem | VText | null>) {
        const filtered:Array<VElem | VText> = child.filter(c => c != null)
        this.children.push(...filtered);
        return this;
    }

    addChild(child: VElem | VText) {
        this.children.push(child);
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