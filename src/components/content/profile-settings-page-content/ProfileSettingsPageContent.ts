import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import NicknameUpdateForm from "../../forms/NicknameUpdateForm";
import PasswordUpdateForm from "../../forms/PasswordUpdateForm";
import AccordionComponent from "../../inputs/AccordionComponent";
import DeleteAccountComponent from "./DeleteAccountContent";

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
                        {title: "Change Nickname", content: NicknameUpdateForm},
                        {title: "Change Password", content: PasswordUpdateForm},
                        {title: "Danger Zone", content: DeleteAccountComponent},
                    ]
                }),

            ])
    }
}