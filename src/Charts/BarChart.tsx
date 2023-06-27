import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function padTo2Digits(num:any) {
  return num.toString().padStart(2, '0');
}

function formatDate(date:any) {
  return [
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
}

function BarChart({ chartData }: any) {
  console.log(chartData)
  const data = {
    labels: chartData[0].map((item:any) => formatDate(new Date(item))),
    datasets: [
      {
        label: ' ',
        data: chartData[1],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  console.log(data)
  return <Bar data={data} className='line_chart'/>;
}

export default BarChart;