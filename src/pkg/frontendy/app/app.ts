import Component from '../component/component.js';

function createApp(component:typeof Component) {
    return new FrontendyAppInstance(component);
}

class FrontendyAppInstance {
    
    private rootComponent:typeof Component;

    constructor(component:typeof Component) {
        this.rootComponent = component;
    }

    public mount(rootNode:HTMLElement) {
        const instance = new this.rootComponent();
        instance.render(rootNode);
    }
}

export {createApp, FrontendyAppInstance};