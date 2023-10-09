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
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import { isMobile } from "react-device-detect";

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
    testDeviceId: string;
}
interface City {
    label: string;
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

function MobileFileInput({
    onFileSelect,
}: {
    onFileSelect: (file: File) => void;
}) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className=" hidden "
            id="mobile-file-input"
        />
    );
}

function formatDate(date: string) {
    // yyyy-mm-dd -> dd/mm/yyyy
    const [y, m, d] = date.split("-");
    return `${y}-${m}-${d}`;
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
    const [citiesList, setCitiesList] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [photoUploadPending, setPhotoUploadPending] = useState(false);

    const [campaign, setCampaign] = useState({
        _id: "",
        title: "",
        startDate: new Date(),
        endDate: new Date(),
        budget: 0,
        country: "",
        targetedCities: [],
        photoPath: "",
        link: "",
        status: "",
        adminMessage: "",
    });
    const [campaignInfo, setCampaignInfo] = useState<CampaignInfo>({
        title: "",
        startDate: "",
        endDate: "",
        budget: "",
        country: "",
        targetedCities: [],
        photoPath: "",
        link: "",
        testDeviceId: "",
    });
    const onDrop = useCallback((acceptedFiles: any) => {
        handlePhotoUpload(acceptedFiles[0]);
    }, []);
    const { getRootProps, isDragActive, open } = useDropzone({
        onDrop,
        maxFiles: 1,
        noClick: true,
    });

    const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);

    const handleMobileFileSelect = (file: File) => {
        handlePhotoUpload(file);
    };

    const openMobileFileInput = () => {
        const fileInput = document.getElementById("mobile-file-input");
        if (fileInput) {
            fileInput.click();
        }
    };

    const renderFileInput = () => {
        if (isMobile) {
            return (
                <div className="mt-1 sm:col-span-2 sm:mt-0 flex-col items-center justify-center">
                    <label
                        htmlFor="mobile-file-input"
                        className="block text-md text-gray-600 border-2 border-gray-600 w-[150px] text-center py-2 mt-3 rounded-md shadow-lg bg-white active:bg-gray-200 hover:bg-gray-100 bg-white"
                    >
                        {t("upload_image")}
                    </label>
                    <MobileFileInput onFileSelect={handleMobileFileSelect} />
                </div>
            );
        } else {
            // Render the desktop file input using react-dropzone
            return (
                <div
                    className={`flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 h-46 mt-10 ${
                        isDragActive ? "bg-green-50" : ""
                    }`}
                    {...getRootProps()}
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
                                        {t("upload_image")}
                                    </span>
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">
                                2090*1284 PNG, JPG, JPEG up to 4MB
                            </p>
                        </div>
                    )}
                </div>
            );
        }
    };

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
    const handleAddAllCities = () => {
        if (campaignInfo.targetedCities.includes("*")) {
            const filteredTargetedCities: string[] =
                campaignInfo.targetedCities.filter(
                    (city: string) => city !== "*"
                );
            setCampaignInfo({
                ...campaignInfo,
                targetedCities: [...filteredTargetedCities],
            });
            return;
        }
        setCampaignInfo({
            ...campaignInfo,
            targetedCities: [...campaignInfo.targetedCities, "*"],
        });
    };
    const handleCitiesChange = (value: any) => {
        setCampaignInfo({
            ...campaignInfo,
            targetedCities: value.map((city: any) => city.value),
        });
    };

    function formatCities(citiesStringArray: string[]) {
        return citiesStringArray.map((city: string) => {
            return { label: t(city), value: city };
        });
    }
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
                    (country) =>
                        country.value.toLowerCase() ===
                        fetchedCampaign.country.toLowerCase()
                )?.name,
            });
        } catch (err: any) {
            console.log(err);
            navigate("/notfound");
        }
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
            new Date(campaignInfo.endDate) <= new Date(campaignInfo.startDate)
        ) {
            const message = t("start_date_greater_than_end_date_message");
            setErrorMessage(message);
            return false;
        }
        if (
            isNaN(Number(campaignInfo.budget)) ||
            Number(campaignInfo.budget) < 5
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

    const saveHandler = async (e: any) => {
        e.preventDefault();
        if (!formIsValid()) return;

        try {
            const data = {
                ...campaignInfo,
                startDate: campaignInfo.startDate,
                endDate: campaignInfo.endDate,
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

    const getCities = async (country: string) => {
        try {
            const { data } = await CampaignsAPI.getCountryCities(
                token,
                country
            );

            const cities: string[] = data.data;
            const formattedCities: City[] = cities.map((city: string) => {
                return { label: t(city), value: city };
            });

            setCitiesList(formattedCities);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        if (!token) return;
        getCampaign();

        setLoading(false);
    }, [token]);

    // if country !== all countries || select country get cities list

    useEffect(() => {
        const country = countryList.find(
            (country) => country.name === campaignInfo.country
        )?.value;
        if (country?.toLowerCase() !== campaign.country.toLowerCase()) {
            setCampaignInfo({
                ...campaignInfo,
                targetedCities: [],
            });
        }
        if (!country || country === "All Countries") {
            setCitiesList([]);
            return;
        }
        getCities(country);
    }, [campaignInfo.country]);

    return (
        <>
            <NavBar index={2} />
            {loading || !campaignInfo.title ? (
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
                    onSubmit={(e) => {
                        e.preventDefault();
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
                                            className=" max-w-lg  border-gray-300 shadow-sm focus:border-[#60b0bd] focus:ring-[#60b0bd] sm:text-sm text-gray-600"
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
                                            className=" max-w-lg  border-gray-300 shadow-sm focus:border-[#60b0bd] focus:ring-[#60b0bd] sm:text-sm text-gray-600"
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
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-[#60b0bd] focus:ring-[#60b0bd]"
                                        />
                                        {Number(campaignInfo.budget) > 0 && (
                                            <p className="mx-2 text-sm my-1 text-gray-600">
                                                {`${t(
                                                    "budget_message_part_1"
                                                )} ${
                                                    i18n.language !== "ar"
                                                        ? "$"
                                                        : ""
                                                }${Number(
                                                    process.env
                                                        .REACT_APP_THOUSAND_VIEWS_COST
                                                )}${
                                                    i18n.language === "ar"
                                                        ? "$"
                                                        : ""
                                                } ${t(
                                                    "budget_message_part_2"
                                                )}: (${(
                                                    (Number(
                                                        campaignInfo.budget
                                                    ) /
                                                        Number(
                                                            process.env
                                                                .REACT_APP_THOUSAND_VIEWS_COST
                                                        )) *
                                                    1000
                                                )
                                                    .toFixed(0)
                                                    .toString()
                                                    .replace(
                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                        ","
                                                    )})`}
                                            </p>
                                        )}
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
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-[#60b0bd] focus:ring-[#60b0bd] "
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
                                                <button
                                                    onClick={handleAddAllCities}
                                                    className={`rounded-md border-2 px-2 py-1 mb-5 text-md ${
                                                        campaignInfo.targetedCities.includes(
                                                            "*"
                                                        )
                                                            ? "bg-green-100 border-2 border-green-600"
                                                            : "border-2 border-gray-200"
                                                    }`}
                                                >
                                                    {t("select_all_locations")}
                                                </button>
                                                <ul className="flex gap-1  w-full max-w-lg flex-wrap">
                                                    {!campaignInfo.targetedCities.includes(
                                                        "*"
                                                    ) ? (
                                                        <Select
                                                            value={formatCities(
                                                                campaignInfo.targetedCities
                                                            )}
                                                            isMulti
                                                            name="cities"
                                                            noOptionsMessage={() =>
                                                                t(
                                                                    "no_options_message"
                                                                )
                                                            }
                                                            options={citiesList}
                                                            onChange={
                                                                handleCitiesChange
                                                            }
                                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-[#60b0bd] focus:ring-[#60b0bd]"
                                                            classNamePrefix="select"
                                                        />
                                                    ) : (
                                                        <></>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <></>
                                )}

                                <div className="">
                                    <label
                                        htmlFor="cover-photo"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        {t("campaign_image")}
                                    </label>
                                    {renderFileInput()}
                                    <PreviewComponent
                                        photoPath={campaignInfo.photoPath}
                                        loading={photoUploadPending}
                                    />
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
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-[#60b0bd] focus:ring-[#60b0bd] "
                                        />
                                    </div>
                                </div>
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label
                                        htmlFor="testDeviceId"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        {t("testDeviceId_input_title")}
                                    </label>
                                    <br />
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <input
                                            type="text"
                                            name="testDeviceId"
                                            id="testDeviceId"
                                            value={campaignInfo.testDeviceId}
                                            placeholder="EX: AB4FB743-57X3-4208-X11X-679D88100F36"
                                            onChange={(e) =>
                                                setCampaignInfo({
                                                    ...campaignInfo,
                                                    testDeviceId:
                                                        e.target.value,
                                                })
                                            }
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-[#60b0bd] focus:ring-[#60b0bd] "
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
                                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-[#60b0bd] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#58a1ad] focus:outline-none focus:ring-2 focus:ring-[#60b0bd] focus:ring-offset-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    saveHandler(e);
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
