import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import AccordionComponent from "../../inputs/AccordionComponent";
import ButtonComponent from "../../inputs/ButtonComponent";
import DeleteAccountModal from "../../modals/DeleteAccountModal";

export default class ProfileSettingsPageContent extends FrontendyComponent {
    componentName: string = 'profile-settings-page-content';    

    data() {
        return {
            isDeleteAccountModalOpen: false,
        }
    }

    template() {
        return elem('div')
            .setProps({class: "flex flex-col gap-4"})
            .setChild([
                new AccordionComponent({
                    items: [
                        {title: "Change Nickname", content: "Profile settings will be here."},
                        {title: "Change Password", content: "Security settings will be here."},
                    ]
                }),

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