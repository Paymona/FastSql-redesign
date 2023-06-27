import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);


function PieChart({ chartData }: any) {
  console.log(chartData)
  const data = {
    labels: chartData[0],
    datasets: [
      {
        label: ' ',
        data: chartData[1],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        borderColor: [
          '#fff'
        ],
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };
  console.log(data)
  return <Pie data={data} className='pie_chart'/>;
}

export default PieChart;