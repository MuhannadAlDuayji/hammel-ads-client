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
type WalletProps = {};

export default function Wallet({}: WalletProps) {
    const [loading, setLoading] = useState(false);

    const token = useSelector((state: any) => state.auth.token);
    const { t, i18n } = useTranslation();
    const language = i18n.language;
    const navigate = useNavigate();

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
                                <TransactionsTable />
                                <br></br>
                                {/* <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/dashboard/wallet/addbalance")
                                    }
                                    className="inline-flex items-center rounded-md border border-transparent bg-[#60b0bd] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#58a1ad] focus:outline-none focus:ring-2 focus:ring-[#60b0bd] focus:ring-offset-2"
                                >
                                    <PlusIcon
                                        className="mx-1 mr-2 h-5 w-5"
                                        aria-hidden="true"
                                    />
                                    {t("add_balance")}
                                </button> */}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
