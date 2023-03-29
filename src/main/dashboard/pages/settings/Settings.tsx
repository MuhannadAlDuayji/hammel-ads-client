import { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import NavBar from "../../shared/NavBar";
import LoadingSpinner from "../../../../utils/LoadingSpinner";
import InvalidInput from "../../../../components/alerts/InvalidInput";
import UpdateSuccess from "../../shared/UpdateSuccess";
import { saveUser } from "../../../../redux/user/userSlice";
import SettingsAPI from "./api/index";
import { useTranslation } from "react-i18next";

type SettingsProps = {};

const languages = [
    { id: 1, name: "العربية", value: "ar" },
    { id: 2, name: "English", value: "en" },
];

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export default function Settings({}: SettingsProps) {
    const [loading, setLoading] = useState(true);
    const { t, i18n } = useTranslation();
    const language = i18n.language;
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

    const [updateInfo, setUpdateInfo] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successContent, setSuccessContent] = useState("");
    const [showSuccessUpdate, setShowSuccessUpdate] = useState(true);

    const dispatch = useDispatch();
    const token = useSelector((state: any) => state.auth.token);
    const user = useSelector((state: any) => state.user.user);

    const changePhotoHandler = async (e: any) => {
        e.preventDefault();
        const profilePhoto = e.target.files[0];
        if (profilePhoto !== null) {
            const formData = new FormData();
            formData.append("profilePhoto", profilePhoto);
            setLoading(true);
            try {
                const response = await SettingsAPI.uploadProfilePhoto(
                    formData,
                    token
                );
                dispatch(
                    saveUser({
                        ...user,
                        photoPath: response.data.data.photoPath,
                    })
                );
                setLoading(false);
            } catch (err: any) {
                console.log(err);
                setErrorMessage("invalid file type");
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (!user) return;
        setLoading(false);
        setUpdateInfo({
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
        });
        setSelectedLanguage(
            languages.find((l: any) => l.value === user.preferredLanguage) ||
                languages[0]
        );
    }, [user]);
    const saveHandler = async (e: any) => {
        e.preventDefault();
        if (updateInfo.firstName.length < 3) {
            return setErrorMessage("invalid first name");
        }
        if (updateInfo.lastName.length < 3) {
            return setErrorMessage("invalid last name");
        }

        // if (
        //     !updateInfo.email.match(
        //         /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        //     )
        // ) {
        //     return setErrorMessage("invalid email address");
        // }

        if (updateInfo.phoneNumber.length < 8) {
            return setErrorMessage("invalid phone number");
        }

        setLoading(true);
        try {
            const response = await SettingsAPI.updateProfile(
                { ...updateInfo, preferredLanguage: selectedLanguage.value },
                token
            );

            dispatch(
                saveUser({
                    ...user,
                    ...updateInfo,
                    preferredLanguage: selectedLanguage.value,
                })
            );
            i18n.changeLanguage(selectedLanguage.value);
            setSuccessContent("updated");
            setShowSuccessUpdate(true);
            setLoading(false);
        } catch (err: any) {
            setLoading(false);
            if (
                err.response.data.message.includes("invalid") ||
                err.response.data.message.includes("email") ||
                err.response.data.message.includes("phone")
            ) {
                setErrorMessage(err.response.data.message);
            }
        }
    };

    return (
        <>
            <NavBar index={-1} />

            <main className="relative mt-10">
                <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
                            {loading ? (
                                <div
                                    className="divide-y divide-gray-200 lg:col-span-9"
                                    style={{
                                        width: "100%",
                                        height: "70vh",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <LoadingSpinner />
                                </div>
                            ) : (
                                <form
                                    dir={language === "ar" ? "rtl" : "ltr"}
                                    className="divide-y divide-gray-200 lg:col-span-9 rtl"
                                    action="#"
                                    method="POST"
                                    onChange={() => {
                                        setErrorMessage("");
                                    }}
                                >
                                    {/* Profile section */}
                                    <div className="py-6 px-4 sm:p-6 lg:pb-8">
                                        <div className="mt-6 flex flex-col lg:flex-row">
                                            <div className="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-shrink-0 lg:flex-grow-0">
                                                <p
                                                    className="text-sm font-medium text-gray-700"
                                                    aria-hidden="true"
                                                >
                                                    {t("photo")}
                                                </p>
                                                <div className="mt-1 lg:hidden">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                                                            aria-hidden="true"
                                                        >
                                                            {user?.photoPath ? (
                                                                <img
                                                                    className="h-full w-full rounded-full"
                                                                    src={
                                                                        user?.photoPath
                                                                    }
                                                                    alt=""
                                                                />
                                                            ) : (
                                                                <svg
                                                                    className="h-full w-full rounded-full"
                                                                    fill="#6B7280"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div className="ml-5 rounded-md shadow-sm">
                                                            <div className="group relative flex items-center justify-center rounded-md border border-gray-300 py-2 px-3 focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:bg-gray-50">
                                                                <label
                                                                    htmlFor="mobile-user-photo"
                                                                    className="pointer-events-none relative text-sm font-medium leading-4 text-gray-700"
                                                                >
                                                                    <span>
                                                                        Change
                                                                    </span>
                                                                    <span className="sr-only">
                                                                        {" "}
                                                                        user
                                                                        photo
                                                                    </span>
                                                                </label>
                                                                <input
                                                                    id="mobile-user-photo"
                                                                    name="profilePhoto"
                                                                    type="file"
                                                                    accept=".png,.jpg,.jpeg,.gif,.svg"
                                                                    className="absolute h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                                                                    onChange={
                                                                        changePhotoHandler
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="relative hidden overflow-hidden rounded-full lg:block">
                                                    {user?.photoPath ? (
                                                        <img
                                                            className="relative h-40 w-40 rounded-full"
                                                            src={
                                                                user?.photoPath
                                                            }
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <svg
                                                            className="relative h-40 w-40 rounded-full"
                                                            fill="#6B7280"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                        </svg>
                                                    )}
                                                    <label
                                                        htmlFor="desktop-user-photo"
                                                        className="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
                                                    >
                                                        <span>Change</span>
                                                        <span className="sr-only">
                                                            {" "}
                                                            user photo
                                                        </span>
                                                        <input
                                                            type="file"
                                                            accept=".png,.jpg,.jpeg,.gif,.svg"
                                                            id="desktop-user-photo"
                                                            name="user-photo"
                                                            className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                                                            onChange={
                                                                changePhotoHandler
                                                            }
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 grid grid-cols-12 gap-6">
                                            <div className="col-span-12 sm:col-span-6">
                                                <label
                                                    htmlFor="first-name"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    {t("first_name")}
                                                </label>
                                                <input
                                                    type="text"
                                                    name="first-name"
                                                    id="first-name"
                                                    autoComplete="given-name"
                                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                                    value={updateInfo.firstName}
                                                    onChange={(e: any) => {
                                                        setUpdateInfo({
                                                            ...updateInfo,
                                                            firstName:
                                                                e.target.value,
                                                        });
                                                    }}
                                                />
                                            </div>

                                            <div className="col-span-12 sm:col-span-6">
                                                <label
                                                    htmlFor="last-name"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    {t("last_name")}
                                                </label>
                                                <input
                                                    type="text"
                                                    name="last-name"
                                                    id="last-name"
                                                    autoComplete="family-name"
                                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                                    value={updateInfo.lastName}
                                                    onChange={(e: any) => {
                                                        setUpdateInfo({
                                                            ...updateInfo,
                                                            lastName:
                                                                e.target.value,
                                                        });
                                                    }}
                                                />
                                            </div>

                                            <div className="col-span-12">
                                                <label
                                                    htmlFor="url"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    {t("email")}
                                                </label>
                                                <input
                                                    type="text"
                                                    name="email"
                                                    id="email"
                                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                                    value={user?.email}
                                                    disabled={true}
                                                    // onChange={(e: any) => {
                                                    //     setUpdateInfo({
                                                    //         ...updateInfo,
                                                    //         email: e.target
                                                    //             .value,
                                                    //     });
                                                    // }}
                                                />
                                            </div>

                                            <div className="col-span-12 sm:col-span-6">
                                                <label
                                                    htmlFor="phoneNumber"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    {t("phone_number")}
                                                </label>
                                                <input
                                                    type="text"
                                                    name="phoneNumber"
                                                    id="phoneNumber"
                                                    autoComplete="organization"
                                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                                    value={
                                                        updateInfo.phoneNumber
                                                    }
                                                    onChange={(e: any) => {
                                                        setUpdateInfo({
                                                            ...updateInfo,
                                                            phoneNumber:
                                                                e.target.value,
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-12 sm:col-span-6">
                                                <label
                                                    htmlFor="language"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    {t("language")}
                                                </label>
                                                <Listbox
                                                    value={selectedLanguage}
                                                    onChange={
                                                        setSelectedLanguage
                                                    }
                                                >
                                                    {({ open }) => (
                                                        <>
                                                            <div className="relative mt-2 w-24">
                                                                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                                    <span className="block truncate">
                                                                        {
                                                                            selectedLanguage.name
                                                                        }
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
                                                                    as={
                                                                        Fragment
                                                                    }
                                                                    leave="transition ease-in duration-100"
                                                                    leaveFrom="opacity-100"
                                                                    leaveTo="opacity-0"
                                                                >
                                                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                        {languages.map(
                                                                            (
                                                                                language
                                                                            ) => (
                                                                                <Listbox.Option
                                                                                    key={
                                                                                        language.id
                                                                                    }
                                                                                    className={({
                                                                                        active,
                                                                                    }) =>
                                                                                        classNames(
                                                                                            active
                                                                                                ? "bg-indigo-600 text-white"
                                                                                                : "text-gray-900",
                                                                                            "relative cursor-default select-none py-2 pl-3 pr-9"
                                                                                        )
                                                                                    }
                                                                                    value={
                                                                                        language
                                                                                    }
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
                                                                                                {
                                                                                                    language.name
                                                                                                }
                                                                                            </span>

                                                                                            {selected ? (
                                                                                                <span
                                                                                                    className={classNames(
                                                                                                        active
                                                                                                            ? "text-white"
                                                                                                            : "text-indigo-600",
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
                                                        </>
                                                    )}
                                                </Listbox>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Privacy section */}
                                    <div className="divide-y divide-gray-200 pt-6">
                                        <div className="mt-4 flex justify-end py-4 px-4 sm:px-6">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                            >
                                                {t("cancel")}
                                            </button>
                                            <button
                                                onClick={saveHandler}
                                                className="mx-5 inline-flex justify-center rounded-md border border-transparent bg-sky-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                            >
                                                {t("save")}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                        <InvalidInput content={errorMessage} />
                    </div>
                </div>
            </main>

            <UpdateSuccess
                content={successContent}
                setShowSuccessUpdate={setShowSuccessUpdate}
                showSuccessUpdate={showSuccessUpdate}
            />
        </>
    );
}
