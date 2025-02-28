import VElem from "./VElem"
import VText from "./VText";

function elem(tag:string): VElem {
    return new VElem(tag);
}

function text(value:any): VText {
    return new VText(value);
}

export {
    elem,
    text,
}