import { isAuthorized } from "../api/client";
import FrontendyRoute, { FrontendyRouteParamType } from "../pkg/frontendy/router/route";
import FrontendyRouter, { FrontendyRouteInfo } from "../pkg/frontendy/router/router";
import AboutPage from "./AboutPage";
import OAuthCallbackPage from "./AuthCallbackPage";
import FriendProfilePage from "./FriendProfilePage";
import GamePage from "./GamePage";
import HomePage from "./HomePage";
import NotFoundPage from "./NotFoundPage";
import ProfilePage from "./ProfilePage";
import ProfileSettingsPage from "./ProfileSettingsPage";

const routes:Array<FrontendyRouteInfo> = [
    {name: "home", path: "/", component: HomePage},
    {name: "about", path: "/about", component: AboutPage},
    {name: "profile", path: "/profile", component: ProfilePage},
    {name: "profile-friend", path: "/profile/:userId", component: FriendProfilePage, paramsTypes: {
        userId: "number"
    }},
    {name: "profile-settings", path: "/profile/settings", component: ProfileSettingsPage},
    {name: "game", path: "/launch/game", component: GamePage},
    {name: "oauth-callback", path: "/oauth-callback", component: OAuthCallbackPage, },
]

const withoutLogin:Array<string> = ["home", "about", "oauth-callback"]

const routerConfig = {
    notFoundPage: NotFoundPage,
    routeIsAvailable: (route: FrontendyRoute) => {
        if (!withoutLogin.includes(route.name) && !isAuthorized()) {
            return 'user is unauthorized'
        }
    }
 }
const router = new FrontendyRouter(routes, routerConfig)

export default router
