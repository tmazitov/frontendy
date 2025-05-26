import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";

type AccordionItem = {
    title: string;
    content: string | typeof FrontendyComponent;
}

type AccordionComponentProps = {
    items: Array<AccordionItem>;
}

export default class AccordionComponent extends FrontendyComponent {
    componentName: string = 'accodion-component';

    constructor(props: AccordionComponentProps) {
        super(props);
    }

    data() {
        return {
            opened: undefined,
        }
    }

    private contentGenerator(item:AccordionItem) {
        if (typeof item.content === 'string' ) {
            return elem('div')
                .setProps({ class: "accordion-content" })
                .addChild(item.content);
        }
        return new item.content();
    }

    private changeOpened(index: number) {
        this.state.opened = this.state.opened === index ? 
            undefined : index;
    }

    template() {

        const itemsComponents = this.props.items.map((item:AccordionItem, index:number) => {

            const isOpen = this.state.opened === index;
            console.log("item title: ", item.title, " isOpen: ", isOpen,);
            const content = this.contentGenerator(item);

            return elem('div')
                .setProps({ class: "accordion-item" })
                .setChild([
                    elem('div')
                    .setProps({ class: `accordion-item-header ${isOpen ? 'opened' : 'closed'} text-lg ${isOpen ? 'text-blue-500' : 'text-black'} font-semibold cursor-pointer flex justify-between` })
                    .addEventListener('click', () => this.changeOpened(index))
                    .setChild([
                        elem('p')
                        .setProps({ class: "select-none transition duration-200 ease-in-out" })
                        .addChild(item.title),

                        elem('i')
                        .setProps({ class: `h-4 w-4 ti ti-chevron-right transition duration-200 ease-in-out` })
                    ]),

                    elem('span')
                    .setProps({ class: `${isOpen ? 'block' : 'hidden'} transition-all duration-200 ease-in-out` })
                    .addChild(content)
                ])
        })

        return elem('div')
            .setProps({ class: "accordion-component flex flex-col gap-2" })
            .setChild([
                ...itemsComponents,
            ])
    }
}