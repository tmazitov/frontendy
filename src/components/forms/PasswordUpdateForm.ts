import { AxiosError } from "axios";
import API from "../../api/api";
import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem } from "../../pkg/frontendy/vdom/constructor";
import PasswordUpdateFormInst from "../../types/forms/updatePasswordForm";
import ButtonComponent from "../inputs/ButtonComponent";
import InputComponent from "../inputs/InputComponent";
import MessageComponent from "../inputs/MessageComponent";

export default class PasswordUpdateForm extends FrontendyComponent {
    componentName: string = 'update-password-form-component';

    data() {
        return {
            form : new PasswordUpdateFormInst("", ""),
            successMessage: undefined,
            errorMessage: undefined,
        }
    }

    async onSubmit() {
        const error = this.state.form.validate();
        if (error) {
            this.state.errorMessage = error;
            return 
        }

        try {
            const response = await API.ums.userUpdatePassword(this.state.form)
            if (response.status == 205 || response.status == 201) {
                this.state.successMessage = "Password updated successfully.";
                this.state.errorMessage = undefined;
                this.state.form = new PasswordUpdateFormInst("", ""); // Reset form after successful update
            }
        } catch (error) {
            console.error("Error updating password:", error);
            this.state.successMessage = undefined;
            
            if (error instanceof AxiosError) {
                if (error.response && error.response.status === 400) {
                    this.state.errorMessage = "Invalid entered data.";
                } else if (error.response && error.response.status === 403) {
                    this.state.errorMessage = "Invalid current password.";
                } else {
                    this.state.errorMessage = "An unexpected error occurred. Please try again later.";
                }
            } else {
                this.state.errorMessage = "Failed to update password. Please try again.";
            }

            return;
        }
    }

    template() {

        const newPasswordInput = new InputComponent(this.state.form.newPassword, {
            label: 'New Password',
            type: 'password',
        }).onInput((value: string) => this.state.form.newPassword = value)

        const oldPasswordInput = new InputComponent(this.state.form.oldPassword, {
            label: 'Current Password',
            type: 'password',
        }).onInput((value: string) => this.state.form.oldPassword = value)
        .onEnter(() => newPasswordInput.focus());

        return elem('div')
            .setProps({class: "flex flex-col gap-4"})
            .setChild([

                new MessageComponent(this.state.successMessage, {color: 'green'}),
                new MessageComponent(this.state.errorMessage, {color: 'red'}),

                oldPasswordInput,
                newPasswordInput,

                new ButtonComponent({
                    label: "Update",
                    color: "blue",
                }).onClick(() => this.onSubmit())
            ])
    }
}