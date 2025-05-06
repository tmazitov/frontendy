import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import ButtonComponent from "../../inputs/ButtonComponent";
import TagComponent, { TagColor } from "../../inputs/TagComponent";

const statuses:Array<{icon:string, label:string, color: TagColor}> = [
    {icon: "ti ti-user-cancel", label : "Offline", color: "gray"},
    {icon: "ti ti-user", label : "Online", color: "green"},
    {icon: "ti ti-brand-apple-arcade", label : "Playing", color: "blue"},
]

export default class InfoContentComponent extends FrontendyComponent {
    componentName: string = 'info-content';
    template() {

        const status = statuses[1];

        return elem('div')
        .setProps({class: "flex gap-4 w-full"})
        .setChild([

            // Image container
            elem('div')
            .setProps({class: "w-32"})
            .setChild([
                elem('div')
                .setProps({class: "size-32 bg-gray-200 rounded-full"})
            ]),

            // Information container
            elem('div')
            .setProps({class: "w-full "})
            .setChild([
                elem('div')
                .setProps({class: "flex flex-col gap-2"})
                .setChild([
                    elem('h2')
                    .setProps({class: "text-xl font-bold"})
                    .addChild(text("username")),

                    elem('p')
                    .setProps({class: "text-gray-600 text-sm"})
                    .addChild(text("Played games: 0")),
                    
                    elem('p')
                    .setProps({class: "text-gray-600 text-sm"})
                    .addChild(text("Rating: 1000 - 7")),

                    elem('div')
                    .setProps({class: "flex gap-2"})
                    .setChild([
                        new ButtonComponent({icon: "ti ti-logout", color: "red", type: "blank"})
                    ]),
                ])
        ])
    ])
    }
}