import { Chart, registerables } from "chart.js";
import { useEffect, useState } from "react";
import moment from "moment";
import { Line } from "react-chartjs-2";
import AnalyticsAPI from "../../../shared/AnalyticsAPI";
import { useSelector } from "react-redux";
Chart.register(...registerables);

interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}

interface ChartDataset {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
    pointBorderColor: string;
    pointBackgroundColor: string;
    pointRadius: number;
    pointBorderWidth: number;
    borderWidth: number;
    tension: number;
}

function formatDate(date: Date): string {
    const month = date.getMonth() + 1; // Months are zero-indexed, so add 1 to get the correct month
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}-${year.toString()}`;
    return formattedDate;
}

function formatDateToLabel(dateString: string): string {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const dateParts = dateString.split("-");
    const monthIndex = parseInt(dateParts[1], 10) - 1;
    const month = months[monthIndex];
    const day = parseInt(dateParts[2], 10);
    return `${month} ${day}`;
}

function ViewsLineChart() {
    const [chartData, setChartData] = useState<ChartData>({
        labels: [],
        datasets: [],
    });

    const token = useSelector((state: any) => state.auth.token);

    const getUserAnalytics = async () => {
        try {
            const today = new Date(); // Get today's date
            const lastTwoWeeks = new Date(
                today.getTime() - 13 * 24 * 60 * 60 * 1000
            ); // Subtract 14 days in milliseconds to get the date two weeks ago

            const startDate = formatDate(lastTwoWeeks); // Convert date to ISO format and extract the date string
            const endDate = formatDate(today); // Do the same for today's date

            const views = await AnalyticsAPI.getTotalAnalytics(
                token,
                "view",
                startDate,
                endDate
            );

            setChartData({
                labels: views.data.data.labels.map((date: string, i: number) =>
                    formatDateToLabel(date)
                ),
                datasets: [
                    {
                        label: "Number Of Views",
                        data: views.data.data.datasets,
                        borderColor: "#6366f1",
                        backgroundColor: "transparent",
                        pointBorderColor: "transparent",
                        pointBackgroundColor: "#6366f1",
                        pointBorderWidth: 8,
                        borderWidth: 7,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 7,
                    },
                ],
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getUserAnalytics();
    }, []);

    const options = {
        scales: {
            x: {
                ticks: {
                    display: false,
                    font: {
                        size: 10,
                    },
                },
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {},
                ticks: {
                    precision: 0,
                },
                beginAtZero: true,
            },
        },

        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return <Line data={chartData} options={options} className="w-full" />;
}

export default ViewsLineChart;
