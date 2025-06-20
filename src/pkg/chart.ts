import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
    Legend
  } from 'chart.js';
import RatingChangeItem from '../types/RatingChangeItem';
  
  Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
    Legend
  );

function pair(num: number) {
    return num < 10 ? `0${num}` : `${num}`;
}

function createRatingChart(elem: HTMLCanvasElement, rates?: Array<RatingChangeItem>) {
    if (!rates || rates.length === 0) {
        console.log(" createRatingChart No rating data available to display the chart");
        return false;
    }
    
    if (!elem) {
        console.log(" createRatingChart Rating chart element is not defined");
        return false;
    }

    console.log("createRatingChart Creating rating chart with data:", rates, elem);

    const myChart = new Chart(elem, {
        type: 'line',
            data: {
            labels: rates.map((item) => `${pair(item.date.getDate())}/${pair(item.date.getMonth() + 1)}`),
            datasets: [{
                label: 'Rating Change',
                data: rates.map(item => item.rate),
                borderColor: '#3b82f6', // Tailwind text-blue-500
                backgroundColor: 'rgba(59, 130, 246, 0.2)', // Semi-transparent fill
                tension: 0.1,
                fill: false,
            }]
            },
            options: {
                responsive: true,
            }
    });

    console.log("createRatingChart Rating chart created successfully", myChart);
}

export {
    createRatingChart,
}