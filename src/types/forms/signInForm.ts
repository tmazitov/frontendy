import Form from "./form";

export default class SignInForm implements Form {
    nickname: string;
    password: string;
    
    constructor(nickname: string, password: string) {
        this.nickname = nickname;
        this.password = password;
    }

    validate(): string | undefined {

        if (!this.nickname.length) {
            return "Enter nickname.";
        }

        if (this.nickname.length < 3) {
            return "Nickname must be at least 3 characters long";
        }

        if (!this.password.length) {
            return "Password is required.";
        }

        if (this.password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
    }

    toSubmit(): Record<string, any> {
        return {
            nickname: this.nickname,
            password: this.password,
        };
    }
}