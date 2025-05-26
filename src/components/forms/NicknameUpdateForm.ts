import { AxiosError } from "axios";
import API from "../../api/api";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";
import Store from "../../store/store";
import ButtonComponent from "../inputs/ButtonComponent";
import InputComponent from "../inputs/InputComponent";
import MessageComponent from "../inputs/MessageComponent";

export default class NicknameUpdateForm extends FrontendyComponent {
    componentName: string = 'nickname-update-form';

    data() {
        return {
            form: {nickname: undefined},
            successMessage: undefined,
            errorMessage: undefined,
        }
    }

    protected onCreated(): void {
        Store.getters.userNickname().then(nickname => {
            this.state.form = {nickname}
        })
    }

    private async onSubmit() {
        if (!this.state.form.nickname) {
            this.state.errorMessage = "Nickname cannot be empty.";
            this.state.successMessage = undefined;
            return;
        }
        try {
            const response = await API.ums.userUpdateNickname(this.state.form.nickname)
            if (response.status == 200) {   
                this.state.successMessage = "Nickname updated successfully.";
                this.state.errorMessage = undefined;
                Store.setters.updateUserNickname(this.state.form.nickname);
            }
        } catch (error) {
            this.state.successMessage = undefined;
            if (error instanceof AxiosError) {
                if (error.response?.status == 409) {
                    this.state.errorMessage = "Nickname is already taken.";
                } else if (error.response?.status == 500) {
                    this.state.errorMessage = "Failed to update user nickname.";
                }
            }
        }
    }

    template() {
        return elem('div')
            .setProps({class: "flex flex-col gap-4"})
            .setChild([
                new MessageComponent(this.state.successMessage, {color: 'green'}),
                new MessageComponent(this.state.errorMessage, {color: 'red'}),

                new InputComponent(this.state.form.nickname, {
                    label: "Nickname",
                }).onInput((value: string) => this.state.form.nickname = value),

                new ButtonComponent({
                    label: "Update",
                    color: "blue",
                }).onClick(() => this.onSubmit())
            ])
    }
}