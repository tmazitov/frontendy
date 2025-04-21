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

export {getComponentUniqueName}