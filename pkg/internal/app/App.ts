import Component from "../component/Component";
import { NoRootError } from "./errors";

class AppConfig {
    port: number = 3000;
    host: string = 'localhost';
}

function createApp(component:typeof Component, config:AppConfig = new AppConfig()) {
    return new App(component, config);
}

class AppComponentRegister {
    private registeredComponents:Map<string, typeof Component> = new Map();

    public add(component: typeof Component, level:number = 0) {

        // Register the component
        this.registerComponent(component.name, component);
        
        console.log(`${"-".repeat(level)}> ${component.name} registered`);

        // Register the child components
        component.components.forEach((child:typeof Component) => this.add(child, level + 2))
    }

    private registerComponent(name:string, component:typeof Component) {

        if (this.registeredComponents.has(name)) {
            return
        }
        
        this.registeredComponents.set(name, component);

        customElements.define(name, component);
    }

    public print(){
        console.log(this.registeredComponents);
    }
}

class App {
    
    private rootComponent:typeof Component;
    private componentRegister:AppComponentRegister = new AppComponentRegister()
    private config:AppConfig;

    constructor(component:typeof Component, config:AppConfig = new AppConfig()) {
        this.config = config;
        this.rootComponent = component;
        this.componentRegister.add(component)
        this.componentRegister.print()
    }

    public mount(elementId:string) {

        const rootNode = document.getElementById(elementId);
        if (!rootNode) {
            throw NoRootError;
        }

        const instance = new this.rootComponent();
        instance.render(rootNode);
        console.log('App is running on port', this.config.port);
    }


}

export {AppConfig, createApp};