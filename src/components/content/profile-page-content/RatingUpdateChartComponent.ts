import { createRatingChart } from "../../../pkg/chart";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";

type RatingUpdateChartComponentProps = {
    rates?: Array<{date: string, rate: number}>
}

export default class RatingUpdateChartComponent extends FrontendyComponent {
    componentName: string = 'rating-update-chart-component';

    constructor(props: RatingUpdateChartComponentProps) {
        super(props);
    }

    protected onMounted(): void {

        const canvas = this.el as HTMLCanvasElement
        if (!canvas) {
            console.error("Canvas element not found in RatingUpdateChartComponent");
            return;
        }

        createRatingChart(canvas, this.props.rates)
    }

    template() {
        return elem('canvas')
            .setProps({id: "rating-update-chart", class: "w-full h-full"})
    }
}