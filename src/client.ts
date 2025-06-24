import { FrontendyAppInstance } from "../src/pkg/frontendy/app/app";
import AppComponent from "../src/components/AppComponent" 

const rootElem = document.querySelector("body");
if (!rootElem) {
  throw new Error("Client error : root id not found");
}
const appInstance = new FrontendyAppInstance(AppComponent)
appInstance.mount(rootElem)