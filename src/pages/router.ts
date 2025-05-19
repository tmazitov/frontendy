import { isAuthorized } from "../api/client";
import FrontendyRoute from "../pkg/frontendy/router/route";
import FrontendyRouter from "../pkg/frontendy/router/router";
import AboutPage from "./AboutPage";
import GamePage from "./GamePage";
import HomePage from "./HomePage";
import NotFoundPage from "./NotFoundPage";
import ProfilePage from "./ProfilePage";
import ProfileSettingsPage from "./ProfileSettingsPage";

const routes:Array<FrontendyRoute> = [
    {name: "home", path: "/", component: HomePage},
    {name: "about", path: "/about", component: AboutPage},
    {name: "profile", path: "/profile", component: ProfilePage},
    {name: "profile-settings", path: "/profile/settings", component: ProfileSettingsPage},
    {name: "game", path: "/lauch/game", component: GamePage},
]

const withoutLogin:Array<string> = ["home", "about"]

const routerConfig = {
    notFoundPage: NotFoundPage,
    routeIsAvailable: (route: FrontendyRoute) => {
        console.log({name: route.name, auth: isAuthorized()})
        if (!withoutLogin.includes(route.name) && !isAuthorized()) {
            return 'user is unauthorized'
        } 
    }
 }
const router = new FrontendyRouter(routes, routerConfig)

export default router
