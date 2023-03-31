import { XCircleIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";

interface InvalidInputProps {
    content?: string;
}

export default function InvalidInput({ content }: InvalidInputProps) {
    const { t, i18n } = useTranslation();
    return (
        <div
            className="rounded-md bg-red-50 p-4"
            style={{ display: content === "" ? "none" : "block" }}
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
            <div className="flex">
                <div className="flex-shrink-0">
                    <XCircleIcon
                        className="h-5 w-5 text-red-400"
                        aria-hidden="true"
                    />
                </div>
                <div className="mx-3">
                    <h3 className="text-sm font-medium text-red-800 text-left">
                        {content}
                    </h3>
                </div>
            </div>
        </div>
    );
}
