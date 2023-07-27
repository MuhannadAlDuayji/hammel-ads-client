import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../../utils/LoadingSpinner";
import AnalyticsAPI from "../../shared/AnalyticsAPI";
import NavBar from "../../shared/NavBar";
import ViewsLineChart from "./components/ViewsLineChart";
import LastTwoWeeksStats from "./components/LastTwoWeeksStats";
import ClicksLineChart from "./components/ClicksLineChart";
import ChartCard from "../../shared/ChartCard";
import { useTranslation } from "react-i18next";

function formatNumber(number: number) {
    return number
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const { t, i18n } = useTranslation();

    const language = i18n.language;

    const [stats, setStats] = useState({
        clicks: 0,
        views: 0,
        clickRate: null,
        balance: 0,
    });

    const user = useSelector((state: any) => state.user.user);
    const token = useSelector((state: any) => state.auth.token);

    const lastTwoWeeksStats = [
        { name: t("total_views"), stat: `${formatNumber(stats.views)}` },
        { name: t("total_clicks"), stat: `${formatNumber(stats.clicks)}` },
        {
            name: t("click_rate"),
            stat: stats.clickRate ? `${stats.clickRate}%` : `0%`,
        },
        {
            name: t("wallet"),
            stat: `$${stats?.balance
                ?.toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        },
    ];

    const today: Date = new Date(); // Get today's date
    const lastTwoWeeks = new Date(today.getTime() - 13 * 24 * 60 * 60 * 1000); // Subtract 14 days in milliseconds to get the date two weeks ago
    const startDate = lastTwoWeeks.toISOString().split("T")[0]; // Convert date to ISO format and extract the date string
    const endDate = today.toISOString().split("T")[0]; // Do the same for today's date
    const getUserStats = async () => {
        try {
            const stats = await AnalyticsAPI.getUserStats(
                token,
                startDate,
                endDate
            );

            if (stats?.data?.data) {
                setStats(stats.data.data);
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getUserStats();

        // Refresh stats every 11 seconds
        const interval = setInterval(getUserStats, 11000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            <NavBar index={0} />
            {loading ? (
                <div
                    style={{
                        width: "100%",
                        height: "90vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="py-10" dir={language === "ar" ? "rtl" : "ltr"}>
                    <main>
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 sm:flex-row">
                            <LastTwoWeeksStats stats={lastTwoWeeksStats} />
                            <br /> <br />
                            <div
                                className="flex justify-around flex-col sm:flex-row mx-4 sm:mx-0 bg-gray-50 px-6 py-12 "
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "20px",
                                }}
                            >
                                <div className="sm:w-1/2 w-full">
                                    <ChartCard
                                        name={t("views")}
                                        from={formatDateToLabel(startDate)}
                                        to={formatDateToLabel(endDate)}
                                    >
                                        <ViewsLineChart />
                                    </ChartCard>
                                </div>
                                <div className="sm:w-1/2 w-full sm:wrap">
                                    <ChartCard
                                        name={t("clicks")}
                                        from={formatDateToLabel(startDate)}
                                        to={formatDateToLabel(endDate)}
                                    >
                                        <ClicksLineChart />
                                    </ChartCard>
                                </div>
                            </div>
                            <br></br> <br></br>
                        </div>
                    </main>
                </div>
            )}
        </>
    );
}

export default Dashboard;
