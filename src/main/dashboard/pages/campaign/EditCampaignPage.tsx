import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import InvalidInput from "../../../../components/alerts/InvalidInput";
import LoadingSpinner from "../../../../utils/LoadingSpinner";
import NavBar from "../../shared/NavBar";
import UpdateSuccess from "../../shared/UpdateSuccess";
import CampaignsAPI from "./api";
import PreviewComponent from "./components/PreviewComponent";
import AdminMessageAlert from "./components/AdminMessageAlert";
import { useTranslation } from "react-i18next";
import Campaign from "../../../../types/campaign";
import { useDropzone } from "react-dropzone";

type Props = {};
interface Country {
    name: string;
    value: string;
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

function formatFetchedDate(date: string) {
    // 2023-01-09T23:00:00.000Z for example to yyyy-mm-dd
    return date.split("T")[0];
}

function EditCampaignPage({}: Props) {
    const campaignId = useParams().id;

    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [errorMessage, setErrorMessage] = useState("");

    const token = useSelector((state: any) => state.auth.token);
    const [countryList, setCountryList] = useState<Country[]>([]);

    const [loading, setLoading] = useState(true);
    const [campaign, setCampaign] = useState({
        _id: "",
        title: "",
        startDate: new Date(),
        endDate: new Date(),
        budget: 0,
        country: "",
        photoPath: "",
        link: "",
        status: "",
        adminMessage: "",
    });
    const [campaignInfo, setCampaignInfo] = useState({
        title: "",
        startDate: "",
        endDate: "",
        budget: "",
        country: "",
        photoPath: "",
        link: "",
    });
    console.log("my info", campaignInfo);

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
            return countries;
        } catch (err) {
            console.log(err);
        }
    };

    const handlePhotoUpload = async (campaignPhoto: File) => {
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
        } catch (err: any) {
            console.log(err);
            setErrorMessage("invalid file type");
        }
    };

    const getCampaign = async () => {
        try {
            const countries: Country[] = await getCountryList();
            const response = await CampaignsAPI.getCampaignById(
                token,
                campaignId || "nothing"
            );
            const fetchedCampaign = response.data.data;
            setCampaign(fetchedCampaign);
            setCampaignInfo({
                ...fetchedCampaign,
                startDate: formatFetchedDate(fetchedCampaign.startDate),
                endDate: formatFetchedDate(fetchedCampaign.endDate),
                country: countries.find(
                    (country) => country.value === fetchedCampaign.country
                )?.name,
            });
        } catch (err: any) {
            console.log(err);
            navigate("/notfound");
        }
    };

    const formIsValid = () => {
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
        if (!isValidHttpUrl(campaignInfo.link)) {
            if (!campaignInfo.link) {
                const message = t("no_campaign_link_message");
                setErrorMessage(message);
            } else {
                const message = t("invalid_campaign_link_message");
                setErrorMessage(message + campaignInfo.link);
            }
            return false;
        }
        return true;
    };

    const saveHandler = async () => {
        if (!formIsValid()) return;

        try {
            const data = {
                ...campaignInfo,
                startDate: formatDate(campaignInfo.startDate),
                endDate: formatDate(campaignInfo.endDate),
                country: countryList.find(
                    (country) => country.name === campaignInfo.country
                )?.value,
            };
            const response = await CampaignsAPI.updateCampaign(
                data,
                campaign._id,
                token
            );
            setShowSuccessUpdate(true);
        } catch (err: any) {
            setErrorMessage(err.response.data.message);
            console.log(err);
        }
    };

    useEffect(() => {
        if (!token) return;
        getCampaign();

        setLoading(false);
    }, [token]);

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
                    onChange={(e) => {
                        e.preventDefault();
                        setErrorMessage("");
                    }}
                    dir={i18n.language === "ar" ? "rtl" : "ltr"}
                >
                    {campaign.adminMessage ? (
                        <AdminMessageAlert message={campaign.adminMessage} />
                    ) : (
                        <></>
                    )}
                    <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                        <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    {t("edit_campaign")}
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    {t("edit_campaign_description")}
                                </p>
                            </div>
                            <div className="space-y-6 sm:space-y-5">
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        {t("campaign_title")}
                                    </label>
                                    <br />
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            autoComplete="given-name"
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label
                                        htmlFor="startDate"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        {t("start_date")}
                                    </label>
                                    <br />
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
                                            className=" max-w-lg  border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-600"
                                        ></input>
                                    </div>
                                </div>
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label
                                        htmlFor="endDate"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        {t("end_date")}
                                    </label>
                                    <br />
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
                                            className=" max-w-lg  border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-600"
                                        ></input>
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label
                                        htmlFor="budget"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        {t("budget")}
                                    </label>
                                    <br />
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
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label
                                        htmlFor="country"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        {t("country")}
                                    </label>
                                    <br />
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
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
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

                                <div className="" {...getRootProps()}>
                                    <label
                                        htmlFor="cover-photo"
                                        className="block text-sm font-medium text-gray-700"
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
                                            <div
                                                className="space-y-1 text-center"
                                                style={{ minWidth: "200px" }}
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
                                                        className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                                    >
                                                        <span>
                                                            {t("upload_image")}
                                                        </span>
                                                    </label>
                                                    <p className="pl-1">
                                                        or drag and drop
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    2090*1284 PNG, JPG, JPEG up
                                                    to 4MB
                                                </p>
                                            </div>
                                        </div>
                                        <PreviewComponent
                                            photoPath={campaignInfo.photoPath}
                                        />
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label
                                        htmlFor="link"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        {t("campaign_link")}
                                    </label>
                                    <br />
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
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
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
                                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    saveHandler();
                                }}
                            >
                                {t("publish")}
                            </button>
                        </div>
                    </div>
                    <InvalidInput content={errorMessage} />
                </form>
            )}

            <UpdateSuccess
                content={t("campaign_updated_message")}
                setShowSuccessUpdate={setShowSuccessUpdate}
                showSuccessUpdate={showSuccessUpdate}
            />
        </>
    );
}

export default EditCampaignPage;
