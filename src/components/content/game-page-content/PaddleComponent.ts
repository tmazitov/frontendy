import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";

type PaddleSideType = 'left' | 'right';

type PaddleComponentProps = {
    top: number;
    side: PaddleSideType
}

export default class PaddleComponent extends FrontendyComponent {
    componentName: string = 'paddle-component';

    constructor(props: PaddleComponentProps) {
        super(props);
        setInterval(() => {
            const el = this.el as HTMLElement;
            el.style.top = `${Math.max(this.props.top + 16, 16)}px`;
        }, 10)
    }

    template() {
        
        const position = `top-[${this.props.top + 16}px] ${this.props.side == 'left' ? 'left' : 'right'}-[16px]`

        return elem('div')
            .setProps({ class: `w-[6px] h-[42px] bg-blue-500 rounded-lg absolute ${position}`})
    }
}