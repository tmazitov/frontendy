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
            authIsFailed: false,
        };
    }

    protected async onCreated() {
        try {
            await GoogleOAuth.authorizeWithGoogle(Config.googleOauthRedirectUri)
        } catch (error) {
            this.state.authIsFailed = true;
            console.log("im here")
            console.log("Error during OAuth authorization:", error);
        }
    }

    template() {

        return elem('div')
            .setProps({ 
                id: "oauth-callback-page", 
                class: "flex flex-col items-center justify-center h-full w-full" 
            })
            .addChild(
                this.state.authIsFailed ? 
                new AuthFailedMessageComponent() : new InProccessMessageComponent()
            )
    }
}