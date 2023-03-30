import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../../../utils/LoadingSpinner";
import NavBar from "../../shared/NavBar";
import WalletAPI from "./api";
import BalanceInfoTable from "./components/BalanceInfoTable";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import TransactionsTable from "./components/TransactionsTable";
import Transaction from "../../../../types/transaction";
import { TransactionType } from "../../../../types/transaction/TransactionType";
import UserPaymentMethodType from "../../../../types/payment method";
type WalletProps = {};

export default function Wallet({}: WalletProps) {
    const [loading, setLoading] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<
        UserPaymentMethodType[]
    >([]);

    const token = useSelector((state: any) => state.auth.token);
    const { t, i18n } = useTranslation();
    const language = i18n.language;
    const navigate = useNavigate();

    const getMethods = async () => {
        try {
            const response = await WalletAPI.getAllPaymentMethods(token);
            const paymentMethodsArray = response.data.data;
            setPaymentMethods(paymentMethodsArray);
        } catch (err) {
            console.log("this is an error", err);
        }
    };

    const removePaymentMethod = async (paymentToken: string) => {
        try {
            const response = await WalletAPI.removePaymentMethod(
                token,
                paymentToken
            );
        } catch (err) {
            console.log("this is an error", err);
        }
    };

    useEffect(() => {
        getMethods();
    }, []);

    return (
        <>
            <NavBar index={3} />

            <div className="py-10" dir={language === "ar" ? "rtl" : "ltr"}>
                <main>
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
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
                            <div className="px-4 py-8 sm:px-0">
                                <BalanceInfoTable />
                                <br></br>
                                <div className="ml-4">
                                    <div className="mt-10 border-t border-gray-200 pt-10">
                                        <h1 className="text-xl">
                                            {t("your_payment_methods")}
                                        </h1>
                                        <br></br>

                                        <p className="text-xs text-gray-500">
                                            {paymentMethods.length === 0 &&
                                                t("no_payment_methods")}
                                        </p>
                                        <ul className="flex gap-1">
                                            {paymentMethods.map(
                                                (
                                                    paymentMethod: UserPaymentMethodType,
                                                    i: number
                                                ) => (
                                                    <div
                                                        className="w-64 h-40 relative bg-gradient-to-r from-indigo-600 via-indigo-800 to-gray-800 rounded-lg shadow-lg "
                                                        key={i}
                                                    >
                                                        <div className="flex justify-between m-2 ">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="34"
                                                                height="34"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="#ffffff"
                                                                fill="none"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <path
                                                                    stroke="none"
                                                                    d="M0 0h24v24H0z"
                                                                    fill="none"
                                                                />
                                                                <rect
                                                                    x="3"
                                                                    y="5"
                                                                    width="18"
                                                                    height="14"
                                                                    rx="3"
                                                                />
                                                                <line
                                                                    x1="3"
                                                                    y1="10"
                                                                    x2="21"
                                                                    y2="10"
                                                                />
                                                                <line
                                                                    x1="7"
                                                                    y1="15"
                                                                    x2="7.01"
                                                                    y2="15"
                                                                />
                                                                <line
                                                                    x1="11"
                                                                    y1="15"
                                                                    x2="13"
                                                                    y2="15"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div className="flex justify-center mt-4">
                                                            <h1 className="text-gray-300 font-thin font-os">
                                                                {paymentMethod.cardInfo.number.toUpperCase()}
                                                            </h1>
                                                        </div>
                                                        <div className="flex flex-col justfiy-end mt-4 p-4 text-gray-400 font-quick">
                                                            <p className="font-bold text-xs">
                                                                {
                                                                    paymentMethod
                                                                        .cardInfo
                                                                        .expiryMonth
                                                                }{" "}
                                                                /{" "}
                                                                {
                                                                    paymentMethod
                                                                        .cardInfo
                                                                        .expiryYear
                                                                }
                                                            </p>
                                                            <h4 className="uppercase tracking-wider font-semibold text-xs">
                                                                {paymentMethod.cardInfo.brand.toUpperCase()}
                                                            </h4>
                                                        </div>

                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="w-4 h-4 absolute top-1 right-1 text-red-500 cursor-pointer"
                                                            onClick={() =>
                                                                removePaymentMethod(
                                                                    paymentMethod.token
                                                                )
                                                            }
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                            />
                                                        </svg>
                                                    </div>
                                                    // </div>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                    <br></br>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/dashboard/wallet/addbalance"
                                            )
                                        }
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        <PlusIcon
                                            className="mx-1 mr-2 h-5 w-5"
                                            aria-hidden="true"
                                        />
                                        {t("add_balance")}
                                    </button>
                                </div>
                                <TransactionsTable />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
