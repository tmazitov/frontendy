import { on } from "events";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import BigAvatarComponent from "../../inputs/BigAvatarComponent";
import AvatarChangeModal from "../../modals/AvatarChangeModal";

export default class ProfileAvatarComponent extends FrontendyComponent {
    componentName: string = 'big-avatar-component';

    constructor(imagePath: string | null) {
        super({imagePath});
    }

    data() {
        return {
            isAvatarChangeModalOpen: false,
            onUpdateHandler: undefined,  
        }
    }

    public onUpdate(fn: Function) {
        this.state.onUpdateHandler = fn;
        return this
    }

    template() {

        return elem('span')
        .setChild([
            new BigAvatarComponent({imagePath: this.props.imagePath})
            .onClick(() => this.state.isAvatarChangeModalOpen = true),

            new AvatarChangeModal()
            .setShow(this.state.isAvatarChangeModalOpen)
            .onSubmit(async (file: File) => {
                if (!this.state.onUpdateHandler) {
                    return
                }
                this.state.onUpdateHandler(file)
            }),
        ])
    }
}