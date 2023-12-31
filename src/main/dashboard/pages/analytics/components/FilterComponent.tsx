import React, { useEffect, Fragment, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import CampaignsAPI from "../../campaign/api";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";

type Gender = "male" | "female" | "all";
interface Props {
    fromDate: Date;
    toDate: Date;
    campaignIdFilter: string;
    countryFilter: string;
    cityFilter: string;
    genderFilter: Gender;
    setGenderFilter: (gender: Gender) => void;
    setFromDate: (date: Date) => void;
    setToDate: (date: Date) => void;
    setCampaignIdFilter: (name: string) => void;
    setCountryFilter: (name: string) => void;
    setCityFilter: (name: string) => void;
}

interface Campaign {
    _id: string;
    title: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    country: string;
}

interface Country {
    name: string;
    value: string;
}

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

const Header: React.FC<Props> = ({
    fromDate,
    toDate,
    campaignIdFilter,
    countryFilter,
    setFromDate,
    setToDate,
    setCampaignIdFilter,
    setCountryFilter,
    cityFilter,
    setCityFilter,
    genderFilter,
    setGenderFilter,
}) => {
    const token = useSelector((state: any) => state.auth.token);
    const { t, i18n } = useTranslation();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [countryList, setCountryList] = useState<Country[]>([]);
    const [cityList, setCityList] = useState<string[]>(["All Regions"]);

    const getCampaigns = async () => {
        try {
            const response = await CampaignsAPI.getAllCampaigns(token);
            const campaigns = response.data.data;
            setCampaigns(campaigns);
        } catch (err: any) {
            console.log(err);
        }
    };

    const getCountries = async () => {
        try {
            const { data } = await CampaignsAPI.getCountryList(token);
            const countries = data.data.countryList.map((country: string) => {
                return { name: t(country.toLowerCase()), value: country };
            });

            setCountryList(countries);
            return countries;
        } catch (err: any) {
            console.log(err);
        }
    };

    const getCities = async (country: string) => {
        try {
            const { data } = await CampaignsAPI.getCountryCities(
                token,
                country
            );

            const cities = data.data;
            setCityList(["All Regions", ...cities]);
            return;
        } catch (err: any) {
            console.log(err);
        }
    };
    const getCampaingName = (campaignId: string) => {
        return campaigns.find((el) => el._id === campaignId)?.title;
    };
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${month}-${day}-${year}`;
    };

    useEffect(() => {
        getCampaigns();
        getCountries();
    }, []);

    useEffect(() => {
        if (!countryFilter.toLowerCase().includes("all countries")) {
            getCities(countryFilter);
        }
        setCityFilter("All Regions");
    }, [countryFilter]);

    return (
        <div className=" shadow  bg-gray-50 mg-20 mb-10">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-around flex-col sm:flex-row ">
                <div className=" lg:w-1/6 mb-4 lg:mb-0 ">
                    <span className="text-sm font-medium leading-6 text-gray-500">
                        {t("filter_by_date")}
                    </span>
                    <div className=" mt-2">
                        <div>
                            <DatePicker
                                // minDate={new Date("01-05-2023")}
                                selected={fromDate}
                                onChange={(date: Date) => {
                                    setFromDate(date);
                                }}
                                className="border-gray-100 relative w-52 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#60b0bd] sm:text-sm sm:leading-6"
                            />
                        </div>
                        <h3 className="mx-2 my-1 align-center text-sm font-medium leading-6 text-gray-400">
                            {t("to")}
                        </h3>

                        <div>
                            <DatePicker
                                selected={toDate}
                                onChange={(date: Date) => {
                                    setToDate(date);
                                }}
                                className="border-gray-100 relative w-52 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#60b0bd] sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>

                {/* select component for campaign name */}

                <Listbox
                    value={campaignIdFilter}
                    onChange={setCampaignIdFilter}
                >
                    {({ open }) => (
                        <div className="ml-5">
                            <Listbox.Label className="text-sm font-medium leading-6 text-gray-500">
                                {t("filter_by_name")}
                            </Listbox.Label>

                            <div className="relative mt-2">
                                <Listbox.Button className="relative w-52 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#60b0bd] sm:text-sm sm:leading-6">
                                    <span className="block truncate">
                                        {campaignIdFilter === ""
                                            ? t("all_campaigns")
                                            : getCampaingName(campaignIdFilter)}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronUpDownIcon
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </Listbox.Button>

                                <Transition
                                    show={open}
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        <Listbox.Option
                                            key={"alloption"}
                                            className={({ active }) =>
                                                classNames(
                                                    active
                                                        ? "bg-[#60b0bd] text-white"
                                                        : "text-gray-900",
                                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                                )
                                            }
                                            value={""}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span
                                                        className={classNames(
                                                            selected
                                                                ? "font-semibold"
                                                                : "font-normal",
                                                            "block truncate"
                                                        )}
                                                    >
                                                        {t("all_campaigns")}
                                                    </span>

                                                    {selected ? (
                                                        <span
                                                            className={classNames(
                                                                active
                                                                    ? "text-white"
                                                                    : "text-[#60b0bd]",
                                                                "absolute inset-y-0 right-0 flex items-center pr-4"
                                                            )}
                                                        >
                                                            <CheckIcon
                                                                className="h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                        {campaigns.map((campaign, i) => (
                                            <Listbox.Option
                                                key={campaign._id}
                                                className={({ active }) =>
                                                    classNames(
                                                        active
                                                            ? "bg-[#60b0bd] text-white"
                                                            : "text-gray-900",
                                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                                    )
                                                }
                                                value={campaign._id}
                                            >
                                                {({ selected, active }) => (
                                                    <>
                                                        <span
                                                            className={classNames(
                                                                selected
                                                                    ? "font-semibold"
                                                                    : "font-normal",
                                                                "block truncate"
                                                            )}
                                                        >
                                                            {campaign.title}
                                                        </span>

                                                        {selected ? (
                                                            <span
                                                                className={classNames(
                                                                    active
                                                                        ? "text-white"
                                                                        : "text-[#60b0bd]",
                                                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                )}
                                                            >
                                                                <CheckIcon
                                                                    className="h-5 w-5"
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </div>
                    )}
                </Listbox>

                {/* gender Filter */}

                <Listbox value={genderFilter} onChange={setGenderFilter}>
                    {({ open }) => (
                        <div className="ml-2">
                            <Listbox.Label className="text-sm font-medium leading-6 text-gray-500">
                                {t("filter_by_gender")}
                            </Listbox.Label>

                            <div className="relative mt-2">
                                <Listbox.Button className="relative w-52 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#60b0bd] sm:text-sm sm:leading-6">
                                    <span className="block truncate">
                                        {t(genderFilter)}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronUpDownIcon
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </Listbox.Button>

                                <Transition
                                    show={open}
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {["all", "male", "female"].map(
                                            (gender, i) => (
                                                <Listbox.Option
                                                    key={i}
                                                    className={({ active }) =>
                                                        classNames(
                                                            active
                                                                ? "bg-[#60b0bd] text-white"
                                                                : "text-gray-900",
                                                            "relative cursor-default select-none py-2 pl-3 pr-9"
                                                        )
                                                    }
                                                    value={gender}
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <span
                                                                className={classNames(
                                                                    selected
                                                                        ? "font-semibold"
                                                                        : "font-normal",
                                                                    "block truncate"
                                                                )}
                                                            >
                                                                {t(gender)}
                                                            </span>

                                                            {selected ? (
                                                                <span
                                                                    className={classNames(
                                                                        active
                                                                            ? "text-white"
                                                                            : "text-[#60b0bd]",
                                                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                    )}
                                                                >
                                                                    <CheckIcon
                                                                        className="h-5 w-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            )
                                        )}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </div>
                    )}
                </Listbox>

                {/* select for country */}
                <div className="flex flex-col ">
                    <Listbox
                        value={countryFilter}
                        onChange={(e) => {
                            console.log(e);
                            setCityFilter("All Regions");
                            setCountryFilter(e);
                        }}
                    >
                        {({ open }) => (
                            <div className="ml-2">
                                <Listbox.Label className="text-sm font-medium leading-6 text-gray-500">
                                    {t("filter_by_country")}
                                </Listbox.Label>
                                <div className="relative mt-2">
                                    <Listbox.Button className="relative w-52 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#60b0bd] sm:text-sm sm:leading-6">
                                        <span className="block truncate">
                                            {countryFilter
                                                .toLowerCase()
                                                .includes("all countries")
                                                ? t("all_countries")
                                                : t(
                                                      countryFilter.toLowerCase()
                                                  )}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon
                                                className="h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </Listbox.Button>

                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {countryList.map((country, i) => (
                                                <Listbox.Option
                                                    key={i + 1}
                                                    className={({ active }) =>
                                                        classNames(
                                                            active
                                                                ? "bg-[#60b0bd] text-white"
                                                                : "text-gray-900",
                                                            "relative cursor-default select-none py-2 pl-3 pr-9"
                                                        )
                                                    }
                                                    value={country?.value}
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <span
                                                                className={classNames(
                                                                    selected
                                                                        ? "font-semibold"
                                                                        : "font-normal",
                                                                    "block truncate"
                                                                )}
                                                            >
                                                                {t(
                                                                    country?.name
                                                                )}
                                                            </span>

                                                            {selected ? (
                                                                <span
                                                                    className={classNames(
                                                                        active
                                                                            ? "text-white"
                                                                            : "text-[#60b0bd]",
                                                                        "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                    )}
                                                                >
                                                                    <CheckIcon
                                                                        className="h-5 w-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </div>
                        )}
                    </Listbox>

                    {!countryFilter.toLowerCase().includes("all countries") ? (
                        <Listbox value={cityFilter} onChange={setCityFilter}>
                            {({ open }) => (
                                <div className="ml-2">
                                    {/* <Listbox.Label className="text-sm font-medium leading-6 text-gray-500">
                                        {t("filter_by_city")}
                                    </Listbox.Label> */}
                                    <div className="relative mt-2">
                                        <Listbox.Button className="relative w-52 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#60b0bd] sm:text-sm sm:leading-6">
                                            <span className="block truncate">
                                                {cityFilter === "All Regions"
                                                    ? t("all_cities")
                                                    : t(cityFilter)}
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon
                                                    className="h-5 w-5 text-gray-400"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </Listbox.Button>

                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {cityList.map((city, i) => (
                                                    <Listbox.Option
                                                        key={i + 1}
                                                        className={({
                                                            active,
                                                        }) =>
                                                            classNames(
                                                                active
                                                                    ? "bg-[#60b0bd] text-white"
                                                                    : "text-gray-900",
                                                                "relative cursor-default select-none py-2 pl-3 pr-9"
                                                            )
                                                        }
                                                        value={city}
                                                    >
                                                        {({
                                                            selected,
                                                            active,
                                                        }) => (
                                                            <>
                                                                <span
                                                                    className={classNames(
                                                                        selected
                                                                            ? "font-semibold"
                                                                            : "font-normal",
                                                                        "block truncate"
                                                                    )}
                                                                >
                                                                    {t(city)}
                                                                </span>

                                                                {selected ? (
                                                                    <span
                                                                        className={classNames(
                                                                            active
                                                                                ? "text-white"
                                                                                : "text-[#60b0bd]",
                                                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                                                        )}
                                                                    >
                                                                        <CheckIcon
                                                                            className="h-5 w-5"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </div>
                            )}
                        </Listbox>
                    ) : (
                        <></>
                    )}
                </div>

                {/* <div className="w-full lg:w-1/4 mx-4 mb-4 lg:mb-0 flex justify-around flex-col">
                    <span className="text-gray-500">Filter by Name:</span>
                    <input
                        type="text"
                        className="w-full py-1 px-2 border border-gray-400 rounded-md"
                        value={nameFilter}
                        onChange={handleNameFilterChange}
                    />
                </div>
                <div className="w-full lg:w-1/4 mx-4 flex justify-around flex-col">
                    <span className="text-gray-500">Filter by Country:</span>
                    <input
                        type="text"
                        className="w-full py-1 px-2 border border-gray-400 rounded-md"
                        value={countryFilter}
                        onChange={handleCountryFilterChange}
                    />
                </div> */}
            </div>
        </div>
    );
};

export default Header;
