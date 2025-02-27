import VElem from "./VElem"

function elem(tag:string): VElem {
    return new VElem(tag);
}

export {
    elem
}