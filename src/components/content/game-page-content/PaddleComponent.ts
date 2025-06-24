import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import TimerStorage from "../../../pkg/timer";
import { MatchPaddleInfo } from "../../../types/MatchSceneInfo";


type PaddleComponentProps = {
    isHidden: boolean,
    info: MatchPaddleInfo,
    side: string,
}

const TICK_RATE = 60;

export default class PaddleComponent extends FrontendyComponent {
    componentName: string = 'paddle-component';

    constructor(props: PaddleComponentProps) {
        super(props);
    }

    protected onMounted(): void {
        TimerStorage.removeTimer(`game-paddle-${this.props.side}`);
        TimerStorage.addTimer(`game-paddle-${this.props.side}`, () => this.updatePosition(), 1000 / TICK_RATE);
    }

    private updatePosition() {
        const el = this.el as HTMLElement;
        if (!el) {
            return ;
        }
        if (this.props.isHidden && el.style.display === 'none') {
            return ;
        }
        if (this.props.isHidden && el.style.display !== 'none') {
            el.style.display = 'none';
            return ;
        }
        const info = this.props.info as MatchPaddleInfo;
        if (el.style.display !== 'block') {
            el.style.display = 'block';
        }
        el.style.height = `${info.width}px`;
        el.style.width = `${info.length}px`;
        el.style.top = `${info.topLeftCornerPosY}px`;
        el.style.left = `${info.topLeftCornerPosX}px`;
    }

    template() {
        return elem('div')
            .setProps({ class: `bg-blue-500 rounded-lg absolute`})
    }
}