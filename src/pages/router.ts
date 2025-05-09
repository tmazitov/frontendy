import FrontendyRoute from "../pkg/frontendy/router/route";
import FrontendyRouter from "../pkg/frontendy/router/router";
import AboutPage from "./AboutPage";
import HomePage from "./HomePage";
import NotFoundPage from "./NotFoundPage";
import ProfilePage from "./ProfilePage";
import ProfileSettingsPage from "./ProfileSettingsPage";

const routes:Array<FrontendyRoute> = [
    {name: "home", path: "/", component: HomePage},
    {name: "about", path: "/about", component: AboutPage},
    {name: "profile", path: "/profile", component: ProfilePage},
    {name: "profile-settings", path: "/profile/settings", component: ProfileSettingsPage},
]

const routerConfig = {
    NotFoundPage: NotFoundPage,
}
const router = new FrontendyRouter(routes, routerConfig)

export default router
