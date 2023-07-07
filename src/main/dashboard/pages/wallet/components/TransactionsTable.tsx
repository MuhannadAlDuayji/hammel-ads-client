import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Transaction from "../../../../../types/transaction";
import WalletAPI from "../api";

function dateFormater(date: Date, separator: string) {
    const day = date.getDate();
    // add +1 to month because getMonth() returns month from 0 to 11
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    // show date and month in two digits
    // if month is less than 10, add a 0 before it
    let dayString = String(day);
    let monthString = String(month);
    if (day < 10) {
        dayString = "0" + day;
    }
    if (month < 10) {
        monthString = "0" + month;
    }
    // now we have day, month and year
    // use the separator to join them
    return dayString + separator + monthString + separator + String(year);
}

export default function TransactionsTable() {
    const { t, i18n } = useTranslation();
    const textDir = i18n.language === "ar" ? "right" : "left";
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const token = useSelector((state: any) => state.auth.token);

    const getTransactions = async () => {
        try {
            const response = await WalletAPI.getTransactions(token);
            const transactionsArray = response.data.data;
            setTransactions(transactionsArray);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getTransactions();
    }, []);
    return (
        <div className="my-20">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold leading-6 text-gray-900">
                        {t("transactions")}
                    </h1>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {transactions?.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className={`py-3.5 pl-4 pr-3 text-${textDir} text-sm font-semibold text-gray-900 sm:pl-0`}
                                        >
                                            {t("payment_method")}
                                        </th>
                                        <th
                                            scope="col"
                                            className={`px-3 py-3.5 text-${textDir} text-sm font-semibold text-gray-900`}
                                        >
                                            {t("amount")}
                                        </th>
                                        <th
                                            scope="col"
                                            className={`px-3 py-3.5 text-${textDir} text-sm font-semibold text-gray-900`}
                                        >
                                            {t("transaction_type")}
                                        </th>
                                        <th
                                            scope="col"
                                            className={`px-3 py-3.5 text-${textDir} text-sm font-semibold text-gray-900`}
                                        >
                                            {t("transaction_date")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {transactions
                                        .reverse()
                                        .map((transaction, i) => (
                                            <tr key={i}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                                                    {transaction?.paymentMethod?.toUpperCase()}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    $
                                                    {transaction.transactionAmount
                                                        .toString()
                                                        .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ","
                                                        )}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                        {t(
                                                            transaction.type.toLowerCase()
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {dateFormater(
                                                        new Date(
                                                            transaction.createdAt
                                                        ),
                                                        "-"
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-xs text-gray-500">
                                {t("no_transactions_yet")}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
