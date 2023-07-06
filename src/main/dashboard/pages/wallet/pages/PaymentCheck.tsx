import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../../../utils/LoadingSpinner";
import { useTranslation } from "react-i18next";
import NavBar from "../../../shared/NavBar";
import { useParams, useSearchParams } from "react-router-dom";
import WalletAPI from "../api";
import PaymentSuccessAlert from "../components/PaymentSuccessAlert";
import { XCircleIcon } from "@heroicons/react/20/solid";

const paymentOptions = [
    { id: "credit-card", title: "Mastercard/Visa" },
    { id: "paypal", title: "PayPal" },
    { id: "etransfer", title: "eTransfer" },
];

const PaymentCheck = () => {
    const [loading, setLoading] = useState(true);
    const { t, i18n } = useTranslation();
    const [queryParameters] = useSearchParams();
    const paymentId = queryParameters.get("paymentId");
    const [info, setInfo] = useState({
        isSuccessfullPayment: null,
        invoiceValue: null,
        invoiceDisplayValue: null,
    });

    const token = useSelector((state: any) => state.auth.token);

    const checkPayment = async () => {
        if (!paymentId) return;
        try {
            const { data } = await WalletAPI.checkPayment(token, paymentId);
            setInfo(data.data);
            setLoading(false);

            if (data.data.isSuccessfullPayment) {
                setTimeout(() => {
                    window.location.href = "/dashboard/wallet";
                }, 3000);
            } else {
                setTimeout(() => {
                    window.location.href = "/dashboard/wallet/addbalance";
                }, 3000);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        checkPayment();
    }, []);

    useEffect(() => {
        console.log(info);
    }, [info]);
    return (
        <div>
            <NavBar index={3} />
            {loading ? (
                <div className="mx-auto mt-52 max-w-2xl px-4 pt-40 pb-24 sm:px-6 lg:max-w-7xl lg:px-8 ">
                    <LoadingSpinner />
                </div>
            ) : info.isSuccessfullPayment ? (
                <div className="mx-auto mt-52 max-w-2xl px-4 pt-40 pb-24 sm:px-6 lg:max-w-7xl lg:px-8 ">
                    <PaymentSuccessAlert />
                </div>
            ) : (
                <div className="mx-auto mt-52 max-w-2xl px-4 pt-40 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div
                        className="rounded-md bg-red-50 p-4"
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
                                <h3 className="text-sm font-medium text-red-800">
                                    {t("payment_error_title")}
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{t("payment_error_message")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// get paymentId
// send it to the backend to check - in the backend we will call the route to check the payment and if successful update the balance and return success
// if success show payment success status
// if failed show payment failed status

// routes needed -> (get: /paymentMethods, post: /executePayment, post: /checkPayment, post: )
export default PaymentCheck;
