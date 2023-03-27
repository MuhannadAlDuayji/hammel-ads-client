import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import CampaignsAPI from "../api";
import { useSelector } from "react-redux";

interface CampaignsTableRowProps {
    campaign: any;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
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

function formatAmount(x: number) {
    return x.toFixed(2);
}

function statusStyles(status: string): string {
    // console.log(status);
    switch (status) {
        case "ready":
        case "active":
            return "text-green-800 bg-green-100";
        case "in review":
        case "waiting for edit":
        case "waiting for funds":
            return "text-orange-800 bg-orange-100";
        case "stopped":
        case "ended":
            return "text-red-800 bg-red-100";

        default:
            return "text-gray-800 bg-gray-100";
    }
}
function formatDate(date: string) {
    // yyyy-mm-dd -> dd/mm/yyyy
    console.log(date);
    const dateString = date.split("T")[0];
    const [y, m, d] = dateString.split("-");

    console.log("formatted date: " + `${m}/${d}/${y}`);
    return `${m}/${d}/${y}`;
}

export default function CampaignTableRow({ campaign }: CampaignsTableRowProps) {
    const token = useSelector((state: any) => state.auth.token);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const editBtnClickHandler = () => {
        navigate(`/dashboard/campaigns/${campaign._id}`);
    };

    const stopBtnClickHandler = async () => {
        try {
            console.log(campaign);
            const response = await CampaignsAPI.updateCampaign(
                {
                    ...campaign,
                    startDate: formatDate(campaign.startDate),
                    endDate: formatDate(campaign.endDate),
                    status: "stopped",
                },
                campaign._id,
                token
            );
            navigate(0);
        } catch (err) {
            console.log(err);
        }
    };
    const resumeBtnClickHandler = async () => {
        try {
            console.log(campaign);
            const response = await CampaignsAPI.updateCampaign(
                {
                    ...campaign,
                    startDate: formatDate(campaign.startDate),
                    endDate: formatDate(campaign.endDate),
                    status: "ready",
                },
                campaign._id,
                token
            );
            navigate(0);
        } catch (err) {
            console.log(err);
        }
    };

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
                ${formatAmount(campaign.budget)}
            </td>

            {/* // money spent */}
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                ${formatAmount(campaign.moneySpent)}
            </td>

            {/* // clicks */}

            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {campaign.clicks}
            </td>

            {/* // click rate */}

            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {campaign.clickRate !== null
                    ? formatAmount(campaign.clickRate)
                    : "0.00"}
            </td>

            {/* // status */}

            <td className="whitspace-nowrap px-3 py-4 text-sm text-gray-500">
                <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusStyles(
                        campaign.status
                    )} `}
                >
                    {t(campaign.status)}
                </span>
            </td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                {/* <Link
                    to={`/dashboard/campaigns/${campaign._id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                >
                    Edit<span className="sr-only">, {campaign.name}</span>
                </Link> */}
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            {t("options")}
                            <ChevronDownIcon
                                className="-mr-1 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </Menu.Button>
                    </div>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute left-0  z-10 m-2 w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={editBtnClickHandler}
                                            className={classNames(
                                                active
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-700",
                                                "block px-4 py-2 text-sm w-full text-left"
                                            )}
                                        >
                                            {t("edit")}
                                        </button>
                                    )}
                                </Menu.Item>
                                {[
                                    "active",
                                    "ready",
                                    "stopped",
                                    "waiting for funds",
                                ].includes(campaign.status.toLowerCase()) && (
                                    <Menu.Item>
                                        {({ active }) => {
                                            return [
                                                "active",
                                                "ready",
                                                "waiting for funds",
                                            ].includes(
                                                campaign.status.toLowerCase()
                                            ) ? (
                                                <button
                                                    onClick={
                                                        stopBtnClickHandler
                                                    }
                                                    className={classNames(
                                                        active
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-700",
                                                        "block px-4 py-2 text-sm text-orange-700 w-full text-left"
                                                    )}
                                                >
                                                    {t("stop")}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={
                                                        resumeBtnClickHandler
                                                    }
                                                    className={classNames(
                                                        active
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-700",
                                                        "block px-4 py-2 text-sm text-green-600 w-full text-left"
                                                    )}
                                                >
                                                    {t("resume")}
                                                </button>
                                            );
                                        }}
                                    </Menu.Item>
                                )}
                                {/* active or ready => stop, stopped => resume  */}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </td>
        </tr>
    );
}
