import API from "../../api/api";
import ModalLayout from "../../layouts/modal/ModalLayout";
import FrontendyComponent from "../../pkg/frontendy/component/component"
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import Store from "../../store/store";
import InputFileComponent from "../inputs/InputFileComponent";

export default class AvatarChangeModal extends FrontendyComponent {
    componentName: string = 'avatar-change-modal';

    data() {
        return {
            show: false,
            onSubmitHandler: undefined,
        }
    }
    public setShow(value: boolean) {
        this.state.show = value;
        return this 
    }

    public onSubmit(fn: Function) {
        this.state.onSubmitHandler = fn;
        return this
    }

    private onSubmitWrapper(file:File) {
        if (!this.state.onSubmitHandler) {
            return
        }
        this.state.onSubmitHandler(file)
        this.setShow(false)
    }

    template() {

        const header = elem("h2")
        .addChild(text("Upload new Avatar"))
        .setProps({ class: "text-xl font-bold text-center" })

        const body = elem("div")
        .setProps({ class: "flex flex-col gap-4" })
        .setChild([
            new InputFileComponent()
            .onSelect(async (file: File) => this.onSubmitWrapper(file)),            
        ])

        return elem("span")
            .addChild(
                new ModalLayout("avatar-change-modal", {
                    onClose: () => this.state.show = false,
                    customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white"
                })
                .setShow(this.state.show)
                .setSlot("header", header)
                .setSlot("body",body)
            )
    }
}