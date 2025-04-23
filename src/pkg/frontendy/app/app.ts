import FrontendyComponent from '../component/component.js';

function createApp(component:typeof FrontendyComponent) {
    return new FrontendyAppInstance(component);
}

class FrontendyAppInstance {
    
    private rootComponent:typeof FrontendyComponent;

    constructor(component:typeof FrontendyComponent) {
        this.rootComponent = component;
    }

    public mount(rootNode:HTMLElement) {
        const instance = new this.rootComponent();
        instance.mount(rootNode);
    }
}

export {createApp, FrontendyAppInstance};