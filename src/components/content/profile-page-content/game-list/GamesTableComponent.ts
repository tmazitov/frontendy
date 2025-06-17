import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem, text } from "../../../../pkg/frontendy/vdom/constructor";
import GameStat from "../../../../types/GameStat";
import ButtonComponent from "../../../inputs/ButtonComponent";
import GamesTableRowComponent from "./GamesTableRowComponent";

type GamesTableComponentProps = {
    onNextPage: Function,
    onPrevPage: Function,
    games: GameStat[];
    userId: number;
    page: number;
}

export default class GamesTableComponent extends FrontendyComponent {
    componentName: string = 'games-table-component';

    constructor(props: GamesTableComponentProps) {
        super(props);
    }

    private onNextPage() {
        if (this.props.onNextPage) {
            this.props.onNextPage();
        }
    }

    private onPrevPage() {
        if (this.props.onPrevPage) {
            this.props.onPrevPage();
        }
    }

    template() {
        return elem('div')
        .setChild([
            elem('div')
            .setProps({class : "h-[320px] w-full overflow-y-auto"})
            .setChild([
                elem('table')
                .setProps({class: 'min-w-full table-auto'})
                .setChild([
                    elem('thead')
                    .setProps({class: 'sticky top-0 z-10'})
                    .setChild([
                        elem('tr').setChild([
                            elem('th')
                            .setProps({class: "p-2 w-1/6 text-start"})
                            .addChild(text('ID')),

                            elem('th')
                            .setProps({class: "p-2 w-1/6 text-start border-l-1 border-gray-200"})
                            .addChild(text('Result')),

                            elem('th')
                            .setProps({class: "p-2 w-1/3 text-start border-l-1 border-gray-200"})
                            .addChild(text('Date')),

                            elem('th')
                            .setProps({class: "p-2 w-1/3 text-start border-l-1 border-gray-200"})
                            .addChild(text('Type')),

                        ]),
                    ]),
                    elem('tbody').setChild(this.props.games.map((game:GameStat) => {
                        return new GamesTableRowComponent(this.props.userId, game);
                    }))
                ]),
            ]),
            elem('div')
            .setProps({class: "w-full flex justify-between items-center mt-4"})
            .setChild([
                new ButtonComponent({icon: "ti ti-chevron-left", type: "outline", isDisabled: this.props.page === 0})
                    .onClick(() => this.onPrevPage()),
                new ButtonComponent({icon: "ti ti-chevron-right", type: "outline", isDisabled: this.props.games.length < 10})
                    .onClick(() => this.onNextPage()),
            ])
        ])
    }
}   