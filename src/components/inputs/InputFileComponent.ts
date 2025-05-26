import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import BigAvatarComponent from "./BigAvatarComponent";
import ButtonComponent from "./ButtonComponent";

export default class InputFileComponent extends FrontendyComponent {
    componentName: string = 'input-file-component';

    data() {
        return {
            selectedFile: null,
            onSelectFileHandler: undefined,
        }
    }

    public onSelect(callback: (file: File) => void) {
        this.state.onSelectFileHandler = callback;
        return this;
    }

    private handleDrop(event: Event) {
        
        event = event as DragEvent;
        
        event.preventDefault();
        const files: FileList = (event as DragEvent).dataTransfer!.files;
        this.handleFiles(files);
    }

    private handleFiles(files: FileList) {
        this.state.selectedFile = files[0];
        // You can now upload the files or display them in the UI
    }

    template() {

        const selectedImageUrl = this.state.selectedFile ? 
            URL.createObjectURL(this.state.selectedFile) : null;

        return elem('span')
        .setChild([

            // Input file container

            elem('div')
            .addEventListener("click", () => document.getElementById('fileInput')?.click())
            .addEventListener("dragover", (event) => event.preventDefault())
            .addEventListener("drop", (event) => this.handleDrop(event))
            .setProps({
                style: `display: ${selectedImageUrl ? 'none' : 'flex'};`,
                class: "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:bg-gray-100 transition p-4",
            })
            .setChild([

                elem('i')
                .setProps({class: "ti ti-photo-scan text-6xl text-gray-400"}),

                elem('p')
                .setProps({class: "text-gray-600 text-center text-sm"})
                .addChild("Drag and drop file here, or click to select"),

                elem('p')
                .setProps({class: "text-gray-400 text-xs"})
                .addChild("Max size: 2MB"),
                
                elem('input')
                .addEventListener("change", (event) => this.handleFiles((event.target as HTMLInputElement).files!))
                .setProps({
                    type: "file",
                    id: "fileInput",
                    class: "hidden",
                }),
            ]),

            // Preload image container

            elem('div')
            .setProps({
                class: "flex flex-col items-center justify-center w-full h-full",
                id: "preload",
                style: `display: ${selectedImageUrl ? 'flex' : 'none'};`
            })
            .setChild([
                
                // Preload image

                elem('span')
                .addChild(new BigAvatarComponent({
                    imagePath:selectedImageUrl,
                })),

                // Buttons 

                elem('div')
                .setProps({class: "flex gap-4 mt-4"})
                .setChild([
                    new ButtonComponent({
                        label: "Cancel",
                        color: 'red',
                        type: "outline",
                    }).onClick(() => {
                        this.state.selectedFile = null
                        const input = document.getElementById('fileInput') as HTMLInputElement;
                        if (input) {
                            input.value = "";
                        }
                    }),

                    new ButtonComponent({
                        label: "Upload",
                        color: 'blue',
                    }).onClick(() => {
                        // Handle file upload here
                        if (this.state.onSelectFileHandler) {
                            this.state.onSelectFileHandler(this.state.selectedFile);
                        }
                    }),
                ])
            ])
        ])
    }
}