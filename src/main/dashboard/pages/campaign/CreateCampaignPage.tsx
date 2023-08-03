import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InvalidInput from "../../../../components/alerts/InvalidInput";
import LoadingSpinner from "../../../../utils/LoadingSpinner";
import NavBar from "../../shared/NavBar";
import UpdateSuccess from "../../shared/UpdateSuccess";
import CampaignsAPI from "./api";
import PreviewComponent from "./components/PreviewComponent";
import { useDropzone } from "react-dropzone";

type Props = {};

interface Country {
    name: string;
    value: string;
}

interface CampaignInfo {
    title: string;
    startDate: string;
    endDate: string;
    budget: string;
    country: string;
    targetedCities: string[];
    photoPath: string;
    link: string;
}

function isValidHttpUrl(string: string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

function formatDate(date: string) {
    // yyyy-mm-dd -> dd/mm/yyyy
    const [y, m, d] = date.split("-");
    return `${m}/${d}/${y}`;
}
function CreateCampaignPage({}: Props) {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [errorMessage, setErrorMessage] = useState("");

    const token = useSelector((state: any) => state.auth.token);
    const [countryList, setCountryList] = useState<Country[]>([]);
    const [citiesList, setCitiesList] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [photoUploadPending, setPhotoUploadPending] = useState(false);

    const [campaignInfo, setCampaignInfo] = useState<CampaignInfo>({
        title: "",
        startDate: "",
        endDate: "",
        budget: "",
        country: "",
        targetedCities: [],
        photoPath: "",
        link: "",
    });

    const onDrop = useCallback((acceptedFiles: any) => {
        handlePhotoUpload(acceptedFiles[0]);
    }, []);
    const { getRootProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
    });

    const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);

    const getCountryList = async () => {
        try {
            const { data } = await CampaignsAPI.getCountryList(token);
            const countries = data.data.countryList.map((country: string) => {
                return { name: t(country.toLowerCase()), value: country };
            });
            setCountryList(countries);
        } catch (err) {
            console.log(err);
        }
    };

    const handlePhotoUpload = async (campaignPhoto: File) => {
        setPhotoUploadPending(true);
        const formData = new FormData();
        formData.append("campaignPhoto", campaignPhoto);
        try {
            const response = await CampaignsAPI.uploadCampaignPhoto(
                formData,
                token
            );
            setCampaignInfo((prev) => {
                return {
                    ...prev,
                    photoPath: response.data.data.photoPath,
                };
            });
            setPhotoUploadPending(false);
        } catch (err: any) {
            console.log(err);
            const message = t("invalid_image_type");
            setErrorMessage(message);
            setLoading(false);
        }
    };

    const handleAddCity = (city: string) => {
        if (!campaignInfo.targetedCities.includes(city)) {
            setCampaignInfo({
                ...campaignInfo,
                targetedCities: [...campaignInfo.targetedCities, city],
            });
        }
    };
    const handleRemoveCity = (city: string) => {
        setCampaignInfo({
            ...campaignInfo,
            targetedCities: campaignInfo.targetedCities.filter(
                (c) => c !== city
            ),
        });
    };

    const formIsValid = () => {
        const country = countryList.find(
            (country) => country.name === campaignInfo.country
        )?.value;
        if (campaignInfo.title.length < 3 || campaignInfo.title.length > 30) {
            const message = t("invalid_campaign_title_message");
            setErrorMessage(message);
            return false;
        }
        if (campaignInfo.startDate === "") {
            const message = t("no_campaign_start_date_message");
            setErrorMessage(message);
            return false;
        }
        if (campaignInfo.endDate === "") {
            const message = t("no_campaign_end_date_message");
            setErrorMessage(message);
            return false;
        }
        if (
            isNaN(Number(campaignInfo.budget)) ||
            Number(campaignInfo.budget) < 10
        ) {
            const message = t("invalid_campaign_budget_message");
            setErrorMessage(message);
            return false;
        }
        if (
            !countryList
                .map((country) => country.name)
                .includes(campaignInfo.country)
        ) {
            const message = t("no_campaign_country_message");
            setErrorMessage(message);
            return false;
        }
        if (campaignInfo.photoPath === "") {
            const message = t("no_campaign_photo_message");
            setErrorMessage(message);
            return false;
        }
        if (
            campaignInfo.targetedCities.length === 0 &&
            country !== "All Countries"
        ) {
            console.log(campaignInfo.country);
            const message = t("no_cities_message");
            setErrorMessage(message);
            return false;
        }
        // if (!campaignInfo.link) {
        //     const message = t("no_campaign_link_message");
        //     setErrorMessage(message);

        //     return false;
        // }
        return true;
    };

    const saveHandler = async (status: string) => {
        if (!formIsValid()) return;

        setLoading(true);
        try {
            const data = {
                ...campaignInfo,
                startDate: formatDate(campaignInfo.startDate),
                endDate: formatDate(campaignInfo.endDate),
                country: countryList.find(
                    (country) => country.name === campaignInfo.country
                )?.value,
                status,
            };
            console.log(data);
            const response = await CampaignsAPI.createCampaign(data, token);
            setLoading(false);
            setShowSuccessUpdate(true);
            setTimeout(() => {
                navigate("/dashboard/campaigns");
            }, 1000);
        } catch (err: any) {
            setLoading(false);
            setErrorMessage(err.message);
            console.log(err);
        }
    };

    const getCities = async (country: string) => {
        try {
            const { data } = await CampaignsAPI.getCountryCities(
                token,
                country
            );

            setCitiesList(data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (!token) return;
        getCountryList();
        setLoading(false);
    }, [token]);

    // if country !== all countries || select country get cities list

    useEffect(() => {
        const country = countryList.find(
            (country) => country.name === campaignInfo.country
        )?.value;
        setCampaignInfo({
            ...campaignInfo,
            targetedCities: [],
        });

        if (!country || country === "All Countries") {
            setCitiesList([]);
            return;
        }
        getCities(country);
    }, [campaignInfo.country]);

    return (
        <>
            <NavBar index={2} />
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
                <form
                    className="space-y-8 divide-y divide-gray-200 m-20"
                    dir={i18n.language === "ar" ? "rtl" : "ltr"}
                    onChange={(e) => {
                        e.preventDefault();
                        setErrorMessage("");
                    }}
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                        <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    {t("create_campaign")}
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    {t("create_campaign_description")}
                                </p>
                            </div>
                            <div className="space-y-6 sm:space-y-5">
                                <div className="">
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        {t("campaign_title")}
                                    </label>
                                    <br></br>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            autoComplete="given-name"
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-[#60b0bd] focus:ring-[#60b0bd]"
                                            value={campaignInfo.title}
                                            onChange={(e) =>
                                                setCampaignInfo({
                                                    ...campaignInfo,
                                                    title: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="block text-sm font-medium text-gray-700">
                                    <label
                                        htmlFor="startDate"
                                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                    >
                                        {t("start_date")}
                                    </label>
                                    <br></br>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <input
                                            type="date"
                                            id="myDate"
                                            name="bday"
                                            min="2024-30-01"
                                            max="2050-01-01"
                                            value={campaignInfo.startDate}
                                            onChange={(e) =>
                                                setCampaignInfo({
                                                    ...campaignInfo,
                                                    startDate: e.target.value,
                                                })
                                            }
                                            className=" max-w-lg  border-gray-300 shadow-sm focus:border-[#60b0bd] focus:ring-[#60b0bd] text-gray-600"
                                        ></input>
                                    </div>
                                </div>
                                <div className="block text-sm font-medium text-gray-700">
                                    <label
                                        htmlFor="endDate"
                                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                    >
                                        {t("end_date")}
                                    </label>
                                    <br></br>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <input
                                            type="date"
                                            id="myDate"
                                            name="bday"
                                            min="2024-30-01"
                                            max="2050-01-01"
                                            value={campaignInfo.endDate}
                                            onChange={(e) =>
                                                setCampaignInfo({
                                                    ...campaignInfo,
                                                    endDate: e.target.value,
                                                })
                                            }
                                            className=" max-w-lg  border-gray-300 shadow-sm focus:border-[#60b0bd] focus:ring-[#60b0bd] text-gray-600"
                                        ></input>
                                    </div>
                                </div>

                                <div className="block text-sm font-medium text-gray-700">
                                    <label
                                        htmlFor="budget"
                                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                    >
                                        {t("budget")}
                                    </label>
                                    <br></br>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <input
                                            type="text"
                                            name="budget"
                                            id="budget"
                                            value={campaignInfo.budget}
                                            onChange={(e) => {
                                                if (
                                                    isNaN(
                                                        Number(e.target.value)
                                                    )
                                                ) {
                                                    return;
                                                }
                                                setCampaignInfo({
                                                    ...campaignInfo,
                                                    budget: e.target.value,
                                                });
                                            }}
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-[#60b0bd] focus:ring-[#60b0bd] "
                                        />
                                    </div>
                                </div>
                                <div className="block text-sm font-medium text-gray-700">
                                    <label
                                        htmlFor="country"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        {t("country")}
                                    </label>
                                    <br></br>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <select
                                            id="country"
                                            name="country"
                                            autoComplete="country-name"
                                            value={campaignInfo.country}
                                            onChange={(e) =>
                                                setCampaignInfo({
                                                    ...campaignInfo,
                                                    country: e.target.value,
                                                })
                                            }
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-[#60b0bd] focus:ring-[#60b0bd]"
                                        >
                                            <option>
                                                {t("please_select_a_country")}
                                            </option>
                                            {countryList.map((country, i) => (
                                                <option key={i}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {citiesList.length > 0 ? (
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label
                                            htmlFor="city"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            {t("targeted_cities")}
                                        </label>
                                        <br />
                                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                                            <div className="block w-full max-w-lg">
                                                <ul className="flex gap-1  w-full max-w-lg flex-wrap">
                                                    {citiesList.map(
                                                        (city, i) => (
                                                            <>
                                                                {!campaignInfo.targetedCities.includes(
                                                                    city
                                                                ) ? (
                                                                    <li
                                                                        key={i}
                                                                        className=" bg-gray-100 flex rounded-lg flex-row gap-2 items-center pr-2"
                                                                    >
                                                                        <p className="m-0 p-0">
                                                                            {t(
                                                                                city
                                                                            )}
                                                                        </p>

                                                                        <button
                                                                            onClick={() =>
                                                                                handleAddCity(
                                                                                    city
                                                                                )
                                                                            }
                                                                            className="text-lg rounded-lg hover:bg-gray-300 w-4"
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </li>
                                                                ) : (
                                                                    <li
                                                                        key={i}
                                                                        className="bg-green-100 flex rounded-lg flex-row gap-2 items-center pr-2 border-2 border-green-600"
                                                                    >
                                                                        <p className="m-0 p-0">
                                                                            {t(
                                                                                city
                                                                            )}
                                                                        </p>

                                                                        <button
                                                                            onClick={() =>
                                                                                handleRemoveCity(
                                                                                    city
                                                                                )
                                                                            }
                                                                            className="text-lg rounded-lg hover:bg-green-200 w-4"
                                                                        >
                                                                            -
                                                                        </button>
                                                                    </li>
                                                                )}
                                                            </>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <></>
                                )}

                                <div className="" {...getRootProps()}>
                                    <label
                                        htmlFor="cover-photo"
                                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                    >
                                        {t("campaign_image")}
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0 flex-col items-center justify-center">
                                        <div
                                            className={`flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 h-46 mt-10 ${
                                                isDragActive
                                                    ? "bg-green-50"
                                                    : ""
                                            }`}
                                        >
                                            {photoUploadPending ? (
                                                <LoadingSpinner />
                                            ) : (
                                                <div
                                                    className="space-y-1 text-center "
                                                    style={{
                                                        minWidth: "200px",
                                                    }}
                                                >
                                                    <svg
                                                        className="mx-auto h-12 w-12 text-gray-400"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 48 48"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <div className="flex text-sm text-gray-600">
                                                        <label
                                                            htmlFor="file-upload"
                                                            className="relative cursor-pointer rounded-md bg-white font-medium text-[#60b0bd] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#60b0bd] focus-within:ring-offset-2 hover:text-[#60b0bd]"
                                                        >
                                                            <span className="px-1">
                                                                {t(
                                                                    "upload_image"
                                                                )}
                                                            </span>
                                                        </label>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        2090*1284 PNG, JPG, JPEG
                                                        up to 4MB
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <PreviewComponent
                                            photoPath={campaignInfo.photoPath}
                                        />
                                    </div>
                                </div>

                                <div className="block text-sm font-medium text-gray-700">
                                    <label
                                        htmlFor="link"
                                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                    >
                                        {t("campaign_link")}
                                    </label>
                                    <br></br>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <input
                                            type="text"
                                            name="link"
                                            id="link"
                                            value={campaignInfo.link}
                                            onChange={(e) =>
                                                setCampaignInfo({
                                                    ...campaignInfo,
                                                    link: e.target.value,
                                                })
                                            }
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-[#60b0bd] focus:ring-[#60b0bd]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-5">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="rounded-md bg-gray-200    border border-gray-300  py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#60b0bd] focus:ring-offset-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    saveHandler("draft");
                                }}
                            >
                                {t("save_draft")}
                            </button>
                            <button
                                type="button"
                                className="mx-3 inline-flex justify-center rounded-md border border-transparent bg-[#60b0bd] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#58a1ad] focus:outline-none focus:ring-2 focus:ring-[#60b0bd] focus:ring-offset-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    saveHandler("in review");
                                }}
                            >
                                {t("to_review")}
                            </button>
                        </div>
                    </div>
                    <InvalidInput content={errorMessage} />
                </form>
            )}

            <UpdateSuccess
                content={t("campaign_created_message")}
                setShowSuccessUpdate={setShowSuccessUpdate}
                showSuccessUpdate={showSuccessUpdate}
            />
        </>
    );
}

export default CreateCampaignPage;
