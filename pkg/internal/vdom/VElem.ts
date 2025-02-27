import createElement from "./createElement";

class VElem {
    public tag:string;
    public props:Record<string, any>;
    public children:(VElem | string)[];
    public innerString: string = "";
    
    constructor(tag:string) {
        this.tag = tag;
        this.props = {};
        this.children = [];
    }

    setProps(props:Record<string, any>) {
        this.props = props;
        return this;
    }

    getProps() {     
        return this.props;
    }

    setChild(child: Array<VElem | string>) {
        this.children.push(...child);
        return this;
    }

    addChild(child: VElem | string) {
        this.children.push(child);
        return this;
    }
    
    createHTMLElement(): HTMLElement {
        return createElement(this);
    }
}

export default VElem;