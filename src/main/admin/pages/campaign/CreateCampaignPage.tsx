import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InvalidInput from "../../../../components/alerts/InvalidInput";
import LoadingSpinner from "../../../../utils/LoadingSpinner";
import NavBar from "../../shared/AdminNavBar";
import UpdateSuccess from "../../shared/UpdateSuccess";
import CampaignsAPI from "./api";
import PreviewComponent from "./PreviewComponent";
import { useDropzone } from "react-dropzone";
import { t } from "i18next";
import { isMobile } from "react-device-detect";

type Props = {};

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
    console.log(date);
    return `${y}-${m}-${d}`;
}
interface Country {
    name: string;
    value: string;
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
            style={{ display: "none" }}
            id="mobile-file-input"
        />
    );
}

function CreateCampaignPage({}: Props) {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState("");

    const token = useSelector((state: any) => state.auth.token);
    const [countryList, setCountryList] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [photoUploadPending, setPhotoUploadPending] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleMobileFileSelect = (file: File) => {
        handlePhotoUpload(file);
    };

    // Function to trigger file input click for mobile devices
    const openMobileFileInput = () => {
        const fileInput = document.getElementById("mobile-file-input");
        if (fileInput) {
            fileInput.click();
        }
    };

    const renderFileInput = () => {
        if (isMobile) {
            return (
                <div
                    className="mt-1 sm:col-span-2 sm:mt-0 flex-col items-center justify-center"
                    onClick={openMobileFileInput}
                >
                    <MobileFileInput onFileSelect={handleMobileFileSelect} />
                    {/* Render your custom file input UI here */}
                    <div className="text-center">
                        {/* Your custom file input UI */}
                        <label
                            htmlFor="mobile-file-input"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                            UPLOAD
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                            2090*1284 PNG, JPG, JPEG (4MB Max)
                        </p>
                        {/* ... (additional UI elements) */}
                        <PreviewComponent photoPath={campaignInfo.photoPath} />
                    </div>
                </div>
            );
        } else {
            // Render the desktop file input using react-dropzone
            return (
                <div className="mt-1 sm:col-span-2 sm:mt-0 flex-col items-center justify-center">
                    <div
                        className={`flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 h-46 mt-10 ${
                            isDragActive ? "bg-green-50" : ""
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
                                            upload an image
                                        </span>
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">
                                    2090*1284 PNG, JPG, JPEG (4MB Max)
                                </p>
                            </div>
                        )}
                    </div>
                    <PreviewComponent photoPath={campaignInfo.photoPath} />
                </div>
            );
        }
    };

    const [campaignInfo, setCampaignInfo] = useState({
        title: "",
        startDate: "",
        endDate: "",
        budget: "",
        country: "",
        photoPath: "",
        link: "",
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

    const getCountryList = async () => {
        try {
            const { data } = await CampaignsAPI.getCountryList(token);
            const countries = data.data.countryList.map((country: string) => {
                return { name: country.toLowerCase(), value: country };
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
            setErrorMessage("invalid file type");
        }
    };

    const formIsValid = () => {
        if (campaignInfo.title.length < 3 || campaignInfo.title.length > 40) {
            setErrorMessage("Title must be between 3 and 40 characters");
            return false;
        }
        if (campaignInfo.startDate === "") {
            setErrorMessage("you must provide a start date");
            return false;
        }
        if (campaignInfo.endDate === "") {
            setErrorMessage("you must provide an end date");
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
            setErrorMessage("budget must be greater than 5");
            return false;
        }
        if (
            !countryList
                .map((country) => country.name)
                .includes(campaignInfo.country)
        ) {
            setErrorMessage("you must provide a country");
            return false;
        }
        if (campaignInfo.photoPath === "") {
            setErrorMessage("you must provide a campaign photo");
            return false;
        }

        // if (!campaignInfo.link) {
        //     setErrorMessage("you must provide a campaign link");

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
                startDate: campaignInfo.startDate,
                endDate: campaignInfo.endDate,
                status,
            };
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

    useEffect(() => {
        if (!token) return;
        setLoading(false);
        getCountryList();
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
                    onChange={() => setErrorMessage("")}
                >
                    <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                        <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Create a Campaign
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    you can create a campaign from here and save
                                    it as draft or send it for review
                                </p>
                            </div>
                            <div className="space-y-6 sm:space-y-5">
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                    >
                                        title
                                    </label>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            autoComplete="given-name"
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-[#60b0bd] focus:ring-[#60b0bd] sm:max-w-xs sm:text-sm"
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
                                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                    >
                                        start date
                                    </label>
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
                                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                    >
                                        end date
                                    </label>
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
                                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                    >
                                        Budget
                                    </label>
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
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-[#60b0bd] focus:ring-[#60b0bd] sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label
                                        htmlFor="country"
                                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                    >
                                        Country
                                    </label>
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
                                                Please select a country
                                            </option>
                                            {countryList.map((country, i) => (
                                                <option key={i}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div
                                    className=""
                                    {...getRootProps()}
                                    onClick={open}
                                >
                                    <label
                                        htmlFor="cover-photo"
                                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                    >
                                        Campaign Image
                                    </label>
                                    {renderFileInput()}
                                </div>

                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label
                                        htmlFor="link"
                                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                    >
                                        link
                                    </label>
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
                                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-[#60b0bd] focus:ring-[#60b0bd] sm:text-sm"
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
                                Save Draft
                            </button>
                            <button
                                type="button"
                                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-[#60b0bd] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#58a1ad] focus:outline-none focus:ring-2 focus:ring-[#60b0bd] focus:ring-offset-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    saveHandler("in review");
                                }}
                            >
                                To Review
                            </button>
                        </div>
                    </div>
                    <InvalidInput content={errorMessage} />
                </form>
            )}

            <UpdateSuccess
                content="Campaign created successfully"
                setShowSuccessUpdate={setShowSuccessUpdate}
                showSuccessUpdate={showSuccessUpdate}
            />
        </>
    );
}

export default CreateCampaignPage;
