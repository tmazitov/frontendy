import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import { MatchBallInfo } from "../../../types/MatchSceneInfo";

type BallComponentProps = {
    isHidden: boolean,
    info: MatchBallInfo,
}

let speedX = 0;
let speedY = 0;

export default class BallComponent extends FrontendyComponent {
    componentName: string = 'ball-component';
    constructor(props: BallComponentProps) {
        super(props);
        setInterval(() => {
            console.log("BallComponent: update called with props:", this.props);
            const el = this.el as HTMLElement;
            if (!el) {
                return;
            }
            if (this.props.isHidden) {
                if (el.style.display !== 'none') {
                    el.style.display = 'none';
                }
                return ;
            }
            if (el.style.display !== 'block') {
                el.style.display = 'block';
            }
            const info = this.props.info as MatchBallInfo;
            el.style.height = `${info.length}px`;
            el.style.width = `${info.width}px`;
            el.style.top = `${info.topLeftCornerPosY}px`;
            el.style.left = `${info.topLeftCornerPosX}px`;
            speedX = info.speedX;
            speedY = info.speedY;
        }, 50)
    }

    template() {
        return elem('div').setProps({class: "bg-red-500 absolute z-10"})
    }
}