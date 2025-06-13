import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import { MatchPaddleInfo } from "../../../types/MatchSceneInfo";


type PaddleComponentProps = {
    isHidden: boolean,
    info: MatchPaddleInfo
}

export default class PaddleComponent extends FrontendyComponent {
    componentName: string = 'paddle-component';

    constructor(props: PaddleComponentProps) {
        super(props);
        setInterval(() => {
            // console.log("PaddleComponent: update called with props:", this.props);
            const el = this.el as HTMLElement;
            if (!el) {
                return ;
            }
            if (el.style.display === 'none') {
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
        }, 50)
    }

    template() {
        return elem('div')
            .setProps({ class: `bg-blue-500 rounded-lg absolute`})
    }
}