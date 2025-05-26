import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import ButtonComponent from "../../inputs/ButtonComponent";
import DeleteAccountModal from "../../modals/DeleteAccountModal";

export default class DeleteAccountComponent extends FrontendyComponent {
    componentName: string = 'delete-account-component';

    data() {
        return {}
    }

    template() {
        return elem('span')
            .setChild([

                new ButtonComponent({   
                    label: "Delete account",    
                    icon: "ti ti-trash",
                    color: "red",
                    type: "outline",
                }).onClick(() => this.state.isDeleteAccountModalOpen = true),

                new DeleteAccountModal().setShow(this.state.isDeleteAccountModalOpen)
            ])
    }
}