import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";

type InfoBarComponentProps = {
    player1Nickname: string;
    player2Nickname: string;
    player1Score: number;
    player2Score: number;
}

export default class InfoBarComponent extends FrontendyComponent {
    componentName: string = 'info-bar-component';

    constructor(props: InfoBarComponentProps) {
        super(props);
    }

    template() {
        return elem('div')
            .setProps({ class: "flex justify-between items-center p-4 w-[512px] "})
            .setChild([
                elem('div')
                .setProps({ class: "text-bold text-md"})
                .addChild(this.props.player1Nickname),

                elem('div')
                .setProps({ class: "text-bold text-lg"})
                .addChild(`${this.props.player1Score} : ${this.props.player2Score}`),
                
                elem('div')
                .setProps({ class: "text-bold text-md"})
                .addChild(this.props.player2Nickname),
            ])
    }
}