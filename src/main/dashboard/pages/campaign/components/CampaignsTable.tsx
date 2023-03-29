import { useTranslation } from "react-i18next";
import CampaignTableRow from "./CampaignTableRow";

interface CampaignTableProps {
    campaigns: any;
}

export default function CampaignsTable({ campaigns }: CampaignTableProps) {
    const { t, i18n } = useTranslation();
    const textDir = i18n.language === "ar" ? "right" : "left";

    return (
        <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg pb-20 ">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className={`py-3.5 pl-4 pr-3 text-${textDir} text-sm font-semibold text-gray-900 sm:pl-6 `}
                                    >
                                        {t("campaign_title")}
                                    </th>
                                    <th
                                        scope="col"
                                        className={`px-3 py-3.5 text-${textDir} text-sm font-semibold text-gray-900`}
                                    >
                                        {t("created_at")}
                                    </th>
                                    <th
                                        scope="col"
                                        className={`px-3 py-3.5 text-${textDir} text-sm font-semibold text-gray-900`}
                                    >
                                        {t("start_date")}
                                    </th>

                                    <th
                                        scope="col"
                                        className={`px-3 py-3.5 text-${textDir} text-sm font-semibold text-gray-900`}
                                    >
                                        {t("end_date")}
                                    </th>
                                    <th
                                        scope="col"
                                        className={`px-3 py-3.5 text-${textDir} text-sm font-semibold text-gray-900`}
                                    >
                                        {t("budget")}
                                    </th>
                                    <th
                                        scope="col"
                                        className={`px-3 py-3.5 text-${textDir} text-sm font-semibold text-gray-900`}
                                    >
                                        {t("money_spent")}
                                    </th>
                                    <th
                                        scope="col"
                                        className={`px-3 py-3.5 text-${textDir} text-sm font-semibold text-gray-900`}
                                    >
                                        {t("clicks")}
                                    </th>
                                    <th
                                        scope="col"
                                        className={`px-3 py-3.5 text-${textDir} text-sm font-semibold text-gray-900`}
                                    >
                                        {t("click_rate")}
                                    </th>
                                    <th
                                        scope="col"
                                        className={`px-3 py-3.5 text-${textDir} text-sm font-semibold text-gray-900`}
                                    >
                                        {t("status")}
                                    </th>

                                    <th
                                        scope="col"
                                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                    >
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {campaigns.map((campaign: any, i: number) => (
                                    <CampaignTableRow
                                        key={i}
                                        campaign={campaign}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
