import Form from "./form";

export default class PasswordUpdateForm implements Form{
    oldPassword: string;
    newPassword: string;
    
    constructor(oldPassword: string, newPassword: string) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

    validate(): string | undefined {

        if (this.newPassword.length < 8) {
            return "New password must be at least 8 characters long.";
        }
        if (this.oldPassword === this.newPassword) {
            return "New password must be different from the old password.";
        }
    }

    toSubmit(): Record<string, any> {
        return {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
        };
    }
}