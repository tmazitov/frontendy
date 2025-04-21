import { FrontendyAppInstance } from "../src/pkg/frontendy/app/app";
import AppComponent from "../src/components/AppComponent" 

console.log("I am client.ts");

const rootElem = document.getElementById("app");
if (!rootElem) {
  throw new Error("Client error : root id not found");
}
const appInstance = new FrontendyAppInstance(AppComponent)
appInstance.mount(rootElem)