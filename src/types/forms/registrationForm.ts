import Form from "./form";

export default class SignUpForm implements Form {
    nickname: string;
    email: string;
    password: string;

    constructor(nickname: string, email: string, password: string) {
        this.nickname = nickname;
        this.email = email;
        this.password = password;
    }

    validate(): string | undefined {
        if (!this.nickname || this.nickname.length < 3) {
            return "Nickname must be at least 3 characters long";
        }
        if (!this.email || !this.email.includes('@')) {
            return "Please enter a valid email address";
        }
        if (!this.password || this.password.length < 6) {
            return "Password must be at least 6 characters long";
        }
        return undefined;
    }

    toSubmit(): Record<string, any> {
        return {
            nickname: this.nickname,
            email: this.email,
            password: this.password
        };
    }
} 