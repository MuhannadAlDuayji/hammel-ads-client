import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CampaignsAPI from "../api";
import DeleteCampaignConfirmModal from "./DeleteCampaignConfirmModal";
import UsersAPI from "../../users/api";

interface CampaignsTableRowProps {
    campaign: any;
}

function formatNumber(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function dateFormater(date: Date, separator: string) {
    const day = date.getDate();
    // add +1 to month because getMonth() returns month from 0 to 11
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // show date and month in two digits
    // if month is less than 10, add a 0 before it
    let dayString = String(day);
    let monthString = String(month);
    if (day < 10) {
        dayString = "0" + day;
    }
    if (month < 10) {
        monthString = "0" + month;
    }

    // now we have day, month and year
    // use the separator to join them
    return dayString + separator + monthString + separator + String(year);
}

function statusStyles(status: string): string {
    switch (status) {
        case "ready":
        case "active":
            return "text-green-800 bg-green-100";
        case "in review":
            return "text-orange-800 bg-orange-100 w-[85px]";
        case "waiting for funds":
            return "text-orange-800 bg-orange-100 w-[80px]";
        case "waiting for edit":
            return "text-orange-800 bg-orange-100 w-[90px]";

        case "stopped":
        case "ended":
            return "text-red-800 bg-red-100";

        default:
            return "text-gray-800 bg-gray-100";
    }
}

export default function CampaignTableRow({ campaign }: CampaignsTableRowProps) {
    const token = useSelector((state: any) => state.auth.token);
    const [user, setUser] = useState<any>(undefined);
    const [selectedCampaignId, setSelectedCampaignId] = useState("");
    const getUser = async () => {
        try {
            const { data } = await UsersAPI.getOneUser(token, campaign.userId);
            setUser(data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getUser();
    }, []);
    return (
        <tr key={campaign.email}>
            {/* // title */}
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div className="flex items-center">
                    <div className="font-medium text-gray-900">
                        {campaign.title}
                    </div>
                </div>
            </td>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                        {/* <img
                            className="h-10 w-10 rounded-full"
                            src={user.photoPath}
                            alt=""
                        /> */}
                        {user?.photoPath ? (
                            <img
                                className="h-10 w-10 rounded-full"
                                src={user?.photoPath}
                                alt=""
                            />
                        ) : (
                            <svg
                                className="h-10 w-10 rounded-full"
                                fill="#6B7280"
                                viewBox="0 0 24 24"
                            >
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        )}
                    </div>
                    <div className="ml-4">
                        <div className="font-medium text-gray-900">
                            {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-gray-500">{user?.email}</div>
                    </div>
                </div>
            </td>
            {/* // creation date */}
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {dateFormater(new Date(campaign.createdAt), "-")}
            </td>
            {/* // start date */}
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {dateFormater(new Date(campaign.startDate), "-")}
            </td>
            {/* // end date */}
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {dateFormater(new Date(campaign.endDate), "-")}
            </td>
            {/* // Budget */}
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatNumber(campaign.budget.toFixed(2))}
            </td>

            {/* // money spent */}
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatNumber(campaign.moneySpent.toFixed(2))}
            </td>
            {/* // views */}

            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatNumber(campaign.views)}
            </td>

            {/* // clicks */}

            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatNumber(campaign.clicks)}
            </td>

            {/* // click rate */}

            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {(((campaign.clicks / (campaign.views || 1)) * 100).toFixed(
                    2
                ) || "0") + "%"}
            </td>

            {/* // status */}

            {/* <td className="py-4 h-[70px] text-sm text-gray-500 flex flex-col gap-2 justify-center">
                <span
                    className={`inline-flex whitespace-nowrap rounded-full px-2 text-xs font-semibold leading-5 h-5 w-20 ${statusStyles(
                        campaign.status
                    )} `}
                >
                    {campaign.status.toUpperCase()}
                </span>
            </td> */}
            <td className="py-4 h-[70px] text-sm text-gray-500 flex flex-col gap-2 justify-center">
                <span
                    className={`inline-flex whitespace-nowrap rounded-full px-1 text-xs font-semibold leading-5 h-5 flex justify-center items-center ${statusStyles(
                        campaign.status
                    )} w-[100%] `}
                >
                    <p>{campaign.status.toUpperCase()}</p>
                </span>

                {!campaign.adminMessage ? (
                    ""
                ) : (
                    <span
                        className={`inline-flex text-center rounded-full px-1 text-xs font-semibold leading-5 bg-red-100 text-red-700 h-5 flex justify-center items-center `}
                    >
                        <p>ACTION REQUIRED</p>
                    </span>
                )}
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
                <Link
                    to={`/admin/dashboard/campaigns/${campaign._id}`}
                    className="text-[#60b0bd] hover:text-indigo-900"
                >
                    Edit
                </Link>
                <div
                    onClick={() => {
                        setSelectedCampaignId(campaign._id);
                    }}
                    className="text-red-600 hover:text-red-900 cursor-pointer"
                >
                    Delete
                </div>
            </td>
            <DeleteCampaignConfirmModal
                selectedCampaignId={selectedCampaignId}
                setSelectedCampaignId={setSelectedCampaignId}
            />
        </tr>
    );
}
