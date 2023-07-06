import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";

interface Props {}

export default function PaymentSuccessAlert({}: Props) {
    const { t, i18n } = useTranslation();

    return (
        <div
            className="rounded-md bg-green-50 p-4"
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
            <div className="flex">
                <div className="flex-shrink-0">
                    <CheckCircleIcon
                        className="h-5 w-5 text-green-400"
                        aria-hidden="true"
                    />
                </div>
                <div className="mx-3">
                    <h3 className="text-sm font-medium text-green-800">
                        {t("payment_successfull")}
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                        <p>{t("payment_successfull_message")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
