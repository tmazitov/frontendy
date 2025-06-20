import { AxiosError } from "axios";
import GoogleOAuth from "../api/oauth/google";
import AuthFailedMessageComponent from "../components/content/auth-callback-content/AuthFailedMessageComponent";
import InProccessMessageComponent from "../components/content/auth-callback-content/InProccessMessageComponent";
import ButtonComponent from "../components/inputs/ButtonComponent";
import Config from "../config";
import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem } from "../pkg/frontendy/vdom/constructor";
import router from "./router";

export default class OAuthCallbackPage extends FrontendyComponent {
    componentName: string = 'oauth-callback-page';

    protected data(): {} {
        return {
            error: {
                message: "",
                status: undefined,
            },
        };
    }

    protected async onCreated() {
        try {
            await GoogleOAuth.authorizeWithGoogle(Config.googleOauthRedirectUri)
        } catch (error) {
            if (error instanceof AxiosError) {
                let errorMessage = ""
                if (error.status == 403) {
                    errorMessage = "Account was deleted some time ago. Please contact our support if you want to restore it.";
                } else if (error.status == 400) {
                    errorMessage = "Invalid request. Please try again.";
                } else if (error.status == 500) {
                    errorMessage = "Server error. Please try again later.";
                } else {
                    errorMessage = "An unexpected error occurred. Please try again.";
                }
                this.state.error = {
                    message: errorMessage,
                    status: error.status || 1,
                }
            } else {
                this.state.error = {
                    message: "An unexpected error occurred. Please try again.",
                    status: 1,
                }
            }
            console.log("Error during OAuth authorization:", error);
        }
    }

    template() {

        return elem('div')
            .setProps({ 
                id: "oauth-callback-page", 
                class: "flex flex-col items-center justify-center h-full w-full pt-8" 
            })
            .addChild(
                this.state.error.status ? 
                new AuthFailedMessageComponent(this.state.error) : new InProccessMessageComponent()
            )
    }
}