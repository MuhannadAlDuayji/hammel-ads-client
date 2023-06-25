import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Data {
    date: string;
    views: number;
    clicks: number;
    clickRate: number;
}
interface props {
    from: Date;
    to: Date;
    data: Array<Data>;
}

function formatDate(date: Date) {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const day = date.getDate();

    return `${monthNames[monthIndex]} ${day}, ${year}`;
}

export default function AnalyticsTable({ from, to, data }: props) {
    const { t, i18n } = useTranslation();
    const language = i18n.language;

    const [totalData, setTotalData] = useState<Data>({
        date: "",
        views: 0,
        clicks: 0,
        clickRate: 0,
    });

    useEffect(() => {
        const views = data.reduce(
            (acc: number, val: any) => acc + val.views,
            0
        );
        const clicks = data.reduce(
            (acc: number, val: any) => acc + val.clicks,
            0
        );
        let clickRate: number = 0;
        if (views !== 0) clickRate = (clicks / views) * 100;
        setTotalData({
            date: "",
            views,
            clicks,
            clickRate,
        });
    }, [data]);

    const textDir = language === "ar" ? "left" : "right";

    return (
        <div
            className="px-4 sm:px-6 lg:px-8"
            dir={language === "ar" ? "rtl" : "ltr"}
        >
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <p className="mt-2 text-sm text-gray-700">
                        {t("statistics_from")}{" "}
                        <time className="font-bold">{formatDate(from)}</time>{" "}
                        {t("to")}{" "}
                        <time className="font-bold">{formatDate(to)}</time>
                    </p>
                </div>
            </div>
            <div className="-mx-4 mt-8 flow-root sm:mx-0">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                        <tr>
                            <th
                                scope="col"
                                className={`py-3.5 pl-4 pr-3 text-${
                                    language === "ar" ? "right" : "left"
                                } text-sm font-semibold text-gray-900 sm:pl-0`}
                            >
                                {t("date")}
                            </th>
                            <th
                                scope="col"
                                className={`hidden py-3.5 px-3 text-${textDir} text-sm font-semibold text-gray-900 sm:table-cell`}
                            >
                                {t("views")}
                            </th>
                            <th
                                scope="col"
                                className={`hidden py-3.5 px-3 text-${textDir} text-sm font-semibold text-gray-900 sm:table-cell`}
                            >
                                {t("clicks")}
                            </th>
                            <th
                                scope="col"
                                className={`py-3.5 pl-3 pr-4 text-${textDir} text-sm font-semibold text-gray-900 sm:pr-0`}
                            >
                                {t("click_rate")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data
                            .filter((date) => date.views !== 0)
                            .map((date, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-gray-200"
                                >
                                    <td className="py-4 pl-4 pr-3 text-sm sm:pl-0">
                                        <div className="font-normal text-gray-900">
                                            {formatDate(new Date(date.date))}
                                        </div>
                                    </td>
                                    <td
                                        className={`hidden py-4 px-3 text-${textDir} text-sm text-gray-500 sm:table-cell`}
                                    >
                                        {date.views}
                                    </td>
                                    <td
                                        className={`hidden py-4 px-3 text-${textDir} text-sm text-gray-500 sm:table-cell`}
                                    >
                                        {date.clicks}
                                    </td>
                                    <td
                                        className={`py-4 pl-3 pr-4 text-${textDir} text-sm text-gray-500 sm:pr-0`}
                                    >
                                        {(
                                            (date.clicks / (date.views || 1)) *
                                            100
                                        ).toFixed(2) + "%"}
                                    </td>
                                </tr>
                            ))}

                        <tr className="border-b border-gray-200">
                            <td className="py-4 pl-4 pr-3 text-sm sm:pl-0">
                                <div className="hidden pl-4 pr-3 text-right text-sm font-bold text-gray-900 sm:table-cell sm:pl-0">
                                    {t("the_total")}
                                </div>
                            </td>
                            <td
                                className={`hidden py-4 px-3 text-${textDir} text-sm text-gray-500 sm:table-cell`}
                            >
                                {totalData.views}
                            </td>
                            <td
                                className={`hidden py-4 px-3 text-${textDir} text-sm text-gray-500 sm:table-cell`}
                            >
                                {totalData.clicks}
                            </td>
                            <td
                                className={`py-4 pl-3 pr-4 text-${textDir} text-sm text-gray-500 sm:pr-0`}
                            >
                                {totalData.clickRate.toFixed(2) + "%"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
