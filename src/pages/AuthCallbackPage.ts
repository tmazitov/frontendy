import GoogleOAuth from "../api/oauth/google";
import Config from "../config";
import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem } from "../pkg/frontendy/vdom/constructor";

export default class OAuthCallbackPage extends FrontendyComponent {
    componentName: string = 'oauth-callback-page';

    protected onCreated(): void {
        GoogleOAuth.authorizeWithGoogle(Config.googleOauthRedirectUri)
    }

    template() {
        return elem('div')
            .setProps({ 
                id: "oauth-callback-page", 
                class: "flex flex-col items-center justify-center h-full w-full" 
            })
            .setChild([
                elem('div')
                    .setProps({ class: "flex flex-col items-center p-4 pt-8" })
                    .addChild([
                        elem('h1').setProps({ class: "text-2xl font-bold" }).setChild(['OAuth Callback Page']),
                        elem('p').setProps({ class: "text-lg" }).setChild(['This is the OAuth callback page.']),
                    ])
            ])
    }
}