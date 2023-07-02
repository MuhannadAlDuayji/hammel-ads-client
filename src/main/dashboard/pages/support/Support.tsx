import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import NavBar from "../../shared/NavBar";
import { useNavigate } from "react-router-dom";
import {
    BuildingOffice2Icon,
    EnvelopeIcon,
    PhoneIcon,
} from "@heroicons/react/24/outline";

type SupportProps = {};

export default function Support({}: SupportProps) {
    const token = useSelector((state: any) => state.auth.token);
    const { t, i18n } = useTranslation();
    const lg = i18n.language;
    const navigate = useNavigate();

    return (
        <>
            <NavBar index={4} />
            <div
                className="relative isolate bg-white"
                dir={lg === "ar" ? "rtl" : "ltr"}
            >
                <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
                    <div className="relative px-6  pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
                        <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
                            <div
                                className={`absolute inset-y-0 ${
                                    lg === "ar" ? "left" : "right"
                                }-0 -z-10 w-full overflow-hidden bg-gray-100 ring-1 ring-gray-900/10 lg:w-1/2`}
                            >
                                <svg
                                    className="relative inset-0 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                                    aria-hidden="true"
                                >
                                    <defs>
                                        <pattern
                                            id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                                            width={200}
                                            height={200}
                                            x="100%"
                                            y={-1}
                                            patternUnits="userSpaceOnUse"
                                        >
                                            <path
                                                d="M130 200V.5M.5 .5H200"
                                                fill="none"
                                            />
                                        </pattern>
                                    </defs>
                                    <rect
                                        width="100%"
                                        height="100%"
                                        strokeWidth={0}
                                        fill="white"
                                    />
                                    <svg
                                        x="100%"
                                        y={-1}
                                        className="overflow-visible fill-gray-50"
                                    >
                                        <path
                                            d="M-470.5 0h201v201h-201Z"
                                            strokeWidth={0}
                                        />
                                    </svg>
                                    <rect
                                        width="100%"
                                        height="100%"
                                        strokeWidth={0}
                                        fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                                {t("support_page_title")}
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                {t("support_page_description")}
                            </p>
                            <dl className="mt-10 space-y-4 text-base leading-7 text-gray-600">
                                <div className="flex gap-x-4">
                                    <dt className="flex-none">
                                        <span className="sr-only">
                                            Telephone
                                        </span>
                                        <EnvelopeIcon
                                            className="h-7 w-6 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </dt>
                                    <dd>
                                        <a
                                            className="hover:text-gray-900"
                                            href="mailto:gyoom@gyoom.sa"
                                        >
                                            gyoom@gyoom.sa
                                        </a>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
