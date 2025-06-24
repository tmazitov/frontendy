import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import Store from "../../../store/store";
import ButtonComponent from "../../inputs/ButtonComponent";
import DeleteAccountModal from "../../modals/DeleteAccountModal";

export default class DeleteAccountComponent extends FrontendyComponent {
    componentName: string = 'delete-account-component';

    data() {
        return {
            isReconnect: false,
        }
    }

    protected onCreated(): void {
        Store.setters.setupReconnect()
        Store.getters.userIsReconnect((isReconnect: boolean | undefined) => this.setIsReconnect(isReconnect))
            .then((isReconnect: boolean | undefined) => this.setIsReconnect(isReconnect))
    }

    private setIsReconnect(isReconnect: boolean | undefined) {
        if (isReconnect === undefined) {
            return ;
        }
        this.state.isReconnect = isReconnect;
    }

    private async onOpenModal() {
        this.state.isDeleteAccountModalOpen = true;
    }

    template() {
        return elem('span')
            .setChild([

                new ButtonComponent({   
                    label: "Delete account",    
                    icon: "ti ti-trash",
                    color: "red",
                    type: "outline",
                    isDisabled: this.state.isReconnect,
                }).onClick(() => this.onOpenModal()),

                new DeleteAccountModal().setShow(this.state.isDeleteAccountModalOpen)
            ])
    }
}