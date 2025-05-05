import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";
import TabItemComponent from "./TabItemComponent";

type TabItem = {
    title: string;
    content: FrontendyComponent;
}

export default class TabsLayout extends FrontendyComponent {
    componentName: string = 'tabs-layout';

    constructor(tabs: TabItem[]) {
        super({tabs});
    }

    data() {
        return {
            currentTab: 0,
        }
    }

    changeCurrentTab(index: number) {
        if (this.state.currentTab == index) {
            return this;
        }

        this.state.currentTab = index;

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
                .addChild(currentTabContent)
            ])
    }
}