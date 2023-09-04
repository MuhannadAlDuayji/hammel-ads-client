import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../../utils/LoadingSpinner";
import AnalyticsAPI from "../../shared/AnalyticsAPI";
import ChartCard from "../../shared/ChartCard";
import NavBar from "../../shared/NavBar";
import AnalyticsTable from "./components/AnalyticsTable";
import ClicksLineChart from "./components/ClicksLineChart";
import FilterComponent from "./components/FilterComponent";
import ViewsLineChart from "./components/ViewsLineChart";

type AnalyticsProps = {};

interface Data {
    views: any;
    clicks: any;
}

function formatDate(date: Date): string {
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
    });
}

function formatDateForRequest(date: Date): string {
    const month = date.getMonth() + 1; // Months are zero-indexed, so add 1 to get the correct month
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${year.toString()}-${month
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
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
    const year = parseInt(dateParts[0], 10);
    return `${day} ${month}, ${year}`;
}
function formatForTable(data: Data) {
    // {labels: [], datasets: []}{labels: [], datasets: []}
    // will become {date, views, clicks, clickrate}
    const dataArray: any[] = [];
    data.views.labels.forEach((label: string, i: number) => {
        const object: any = { date: "", views: 0, clicks: 0, clickRate: 0 };

        object.date = formatDateToLabel(label);
        object.views = data.views.datasets[i];
        object.clicks = data.clicks.datasets[i];
        if (object.views !== 0) {
            object.clickRate = (object.clicks / (object.views || 1)) * 100;
        }
        dataArray.push(object);
    });
    return dataArray;
}

export default function Analytics({}: AnalyticsProps) {
    const token = useSelector((state: any) => state.auth.token);
    const { t, i18n } = useTranslation();

    const language = i18n.language;
    const [loading, setLoading] = useState(true);
    const oneMonthAgo = new Date().getTime() - 1000 * 60 * 60 * 24 * 30;
    const [fromDate, setFromDate] = useState<Date>(new Date(oneMonthAgo));
    const [toDate, setToDate] = useState<Date>(new Date());
    const [campaignIdFilter, setCampaignIdFilter] = useState("");
    const [countryFilter, setCountryFilter] = useState("All Countries");
    const [cityFilter, setCityFilter] = useState("All Regions");

    const [data, setData] = useState<Data>({
        views: {
            labels: [],
            datasets: [],
        },
        clicks: {
            labels: [],
            datasets: [],
        },
    });

    const getData = async () => {
        try {
            const clicks = await AnalyticsAPI.getTotalAnalytics(
                token,
                "click",
                formatDateForRequest(fromDate),
                formatDateForRequest(toDate),
                countryFilter.toLowerCase() === "all countries"
                    ? null
                    : countryFilter,
                cityFilter.toLowerCase() === "all regions" ? null : cityFilter,
                campaignIdFilter === "" ? null : campaignIdFilter
            );

            const views = await AnalyticsAPI.getTotalAnalytics(
                token,
                "view",
                formatDateForRequest(fromDate),
                formatDateForRequest(toDate),
                countryFilter.toLowerCase() === "all countries"
                    ? null
                    : countryFilter,
                cityFilter.toLowerCase() === "all regions" ? null : cityFilter,
                campaignIdFilter === "" ? null : campaignIdFilter
            );

            setData({ clicks: clicks.data.data, views: views.data.data });
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getData();
    }, [fromDate, toDate, countryFilter, campaignIdFilter, cityFilter]);

    return (
        <>
            <NavBar index={1} />
            {loading ? (
                <div
                    style={{
                        width: "100%",
                        height: "80vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <LoadingSpinner />
                </div>
            ) : (
                <div dir={language === "ar" ? "rtl" : "ltr"}>
                    <FilterComponent
                        fromDate={fromDate}
                        setFromDate={setFromDate}
                        toDate={toDate}
                        setToDate={setToDate}
                        campaignIdFilter={campaignIdFilter}
                        setCampaignIdFilter={setCampaignIdFilter}
                        countryFilter={countryFilter}
                        setCountryFilter={setCountryFilter}
                        cityFilter={cityFilter}
                        setCityFilter={setCityFilter}
                    />
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-around flex-col sm:flex-row gap-5 bg-gray-50">
                        <div className="sm:w-1/2">
                            <ChartCard
                                name={t("views")}
                                from={formatDate(fromDate)}
                                to={formatDate(toDate)}
                            >
                                <ViewsLineChart views={data.views} />
                            </ChartCard>
                        </div>
                        <div className="sm:w-1/2">
                            <ChartCard
                                name={t("clicks")}
                                from={formatDate(fromDate)}
                                to={formatDate(toDate)}
                            >
                                <ClicksLineChart clicks={data.clicks} />
                            </ChartCard>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 shadow rounded-lg mb-5">
                        <AnalyticsTable
                            from={fromDate}
                            to={toDate}
                            data={formatForTable(data)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
