import Form from "./form";

export default class SignInForm implements Form {
    email: string;
    password: string;
    
    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    validate(): string | undefined {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email.length || !emailRegex.test(this.email)) {
            return "Invalid email address.";
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
            email: this.email,
            password: this.password,
        };
    }
}