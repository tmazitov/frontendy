import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";
import TabItemComponent from "./TabItemComponent";

type TabItem = {
    title: string;
    content: typeof FrontendyComponent;
}

function getItem(name: string, tabsAmount: number) {
    const rawValue = parseInt(localStorage.getItem(`${name}-current-tab`) || '0')
    return Math.min(Math.max(rawValue, 0), tabsAmount - 1);
}

function setItem(name: string, index: number) {
    localStorage.setItem(`${name}-current-tab`, index.toString());
    return index;
}

export default class TabsLayout extends FrontendyComponent {
    componentName: string = 'tabs-layout';

    constructor(name:string, tabs: TabItem[], disableSave?:boolean) {
        super({name, tabs, disableSave});
    }

    data() {    
        return {
            currentTab: this.props.disableSave ? 
                0 :    
                getItem(this.props.name, this.props.tabs.length),
        }
    }

    changeCurrentTab(index: number) {
        if (this.state.currentTab == index) {
            return this;
        }

        if (this.props.disableSave) {
            this.state.currentTab = index;
            return this;
        }
        this.state.currentTab = setItem(this.props.name, index);

        return this;    
    }

    template() {

        const currentTabContent = this.props.tabs[this.state.currentTab].content;

        return elem('div')
            .setChild([

                // Tabs
                elem("div")
                .setProps({ class : "flex border-b-1 border-gray-200" })
                .setChild(this.props.tabs.map((tab: TabItem, index: number) => {
                    return new TabItemComponent(tab.title, this.state.currentTab == index)
                        .onClick(() => this.changeCurrentTab(index))
                })),

                // Tab content
                elem("div")
                .setProps({ class : "p-4" })
                .addChild(new currentTabContent())
            ])
    }
}