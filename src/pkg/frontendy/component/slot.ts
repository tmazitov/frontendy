import VElem from "../vdom/VElem";
import VText from "../vdom/VText";
import FrontendyComponent from "./component";

class FrontendySlot {
    public name: string;
    private value: FrontendyComponent | VElem | VText | undefined = undefined;

    constructor(name: string) {
        this.name = name       
    }

    set(value: FrontendyComponent | VElem | VText) {
        this.value = value;
    }

    render() {
        return this.value ?? null;
    }
}   

export default FrontendySlot;