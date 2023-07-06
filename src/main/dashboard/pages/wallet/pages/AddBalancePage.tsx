import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WalletAPI from "../api";
import CreditCardView from "../components/CreditCardView";
import LoadingSpinner from "../../../../../utils/LoadingSpinner";
import UpdateSuccess from "../../../shared/UpdateSuccess";
import { useNavigate } from "react-router-dom";
import InvalidInput from "../../../../../components/alerts/InvalidInput";
import { useTranslation } from "react-i18next";
import NavBar from "../../../shared/NavBar";
const paymentOptions = [
    { id: "credit-card", title: "Mastercard/Visa" },
    { id: "paypal", title: "PayPal" },
    { id: "etransfer", title: "eTransfer" },
];

interface PaymentMethod {
    PaymentMethodId: number;
    PaymentMethodAr: string;
    PaymentMethodEn: string;
    PaymentMethodCode: string;
    IsDirectPayment: boolean;
    ServiceCharge: number;
    TotalAmount: number;
    CurrencyIso: string | null;
    ImageUrl: string;
    IsEmbeddedSupported: boolean;
    PaymentCurrencyIso: string;
}

const AddBalancePage = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { t, i18n } = useTranslation();
    const [showSuccessStatus, setShowSuccessStatus] = useState(true);
    const [showErrorStatus, setShowErrorStatus] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [cardDetails, setCardDetails] = useState({
        Number: "",
        ExpiryMonth: "",
        ExpiryYear: "",
        SecurityCode: "",
        HolderName: "",
    });
    const [amountInfo, setAmountInfo] = useState({
        amount: 0,
        fees: 0,
        total: 0,
    });

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

    const token = useSelector((state: any) => state.auth.token);
    const navigate = useNavigate();

    const getMethods = async () => {
        try {
            const response = await WalletAPI.getPaymentMethods(token);
            const paymentMethodsArray: PaymentMethod[] =
                response.data.paymentMethods;
            const desiredOrder = [
                "Apple Pay",
                "Apple Pay (Mada)",
                "MADA",
                "STC Pay",
                "VISA/MASTER",
                "QPay",
                "KNET",
                "UAE Debit Cards",
                "AMEX",
                "GooglePay",
                "Benefit",
            ];

            console.log(paymentMethodsArray);

            const sortedArray: PaymentMethod[] = [];

            for (const paymentMethod of desiredOrder) {
                const matchingMethods = paymentMethodsArray.filter(
                    (pm: PaymentMethod) =>
                        pm.PaymentMethodEn.toUpperCase().trim() ===
                        paymentMethod.toUpperCase().trim()
                );
                sortedArray.push(...matchingMethods);
            }

            setPaymentMethods(sortedArray);

            // if (paymentMethodsArray.length > 0) {
            //     setSelectedPaymentMethod(
            //         paymentMethodsArray[0].cardInfo.number
            //     );
            // }
        } catch (err) {
            console.log(err);
        }
    };

    const redirectToPaymentURL = async (paymentMethodId: number) => {
        try {
            setLoading(true);
            const response = await WalletAPI.getPaymentURL(
                token,
                amountInfo.amount,
                paymentMethodId
            );
            window.location.href = response.data.data.paymentUrl;

            // if (paymentMethodsArray.length > 0) {
            //     setSelectedPaymentMethod(
            //         paymentMethodsArray[0].cardInfo.number
            //     );
            // }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getMethods();
    }, []);

    const showSuccess = (message: string) => {
        setShowErrorStatus(false);
        setShowSuccessStatus(true);
        setMessage(message);
    };
    const showError = (message: string) => {
        setShowErrorStatus(true);
        setShowSuccessStatus(false);
        setMessage(message);
    };

    const redirect = () => {
        setTimeout(() => {
            navigate("/dashboard/wallet");
        }, 2000);
    };
    const checkForm = () => {
        const { Number, ExpiryMonth, ExpiryYear, SecurityCode, HolderName } =
            cardDetails;

        // Check if any field is empty
        if (
            !Number ||
            !ExpiryMonth ||
            !ExpiryYear ||
            !SecurityCode ||
            !HolderName
        ) {
            const errorMessage = t("fill_all_fields");
            setMessage(errorMessage);
            return false;
        }

        // Check if the card number is valid
        const cardNumberRegex = /^\d{16}$/;
        if (!cardNumberRegex.test(Number)) {
            const errorMessage = t("invalid_card_number");
            setMessage(errorMessage);
            return false;
        }

        // Check if the expiry date is valid
        const currentYear = new Date().getFullYear();
        const expiryDate = new Date(`${ExpiryMonth}/01/${ExpiryYear}`);
        if (
            expiryDate < new Date() ||
            expiryDate.getFullYear() > currentYear + 10
        ) {
            const errorMessage = t("invalid_expiry_date");
            setMessage(errorMessage);
            return false;
        }

        // Check if the security code is valid
        const securityCodeRegex = /^\d{3}$/;
        if (!securityCodeRegex.test(SecurityCode)) {
            const errorMessage = t("invalid_security_code");
            setMessage(errorMessage);
            return false;
        }

        // Check if the holder name is valid
        const holderNameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
        if (!holderNameRegex.test(HolderName)) {
            const errorMessage = t("invalid_holder_name");
            setMessage(errorMessage);
            return false;
        }

        // All fields are valid
        setMessage("");
        return true;
    };

    // const executeNewCreditCardPayment = async () => {
    //     if (!checkForm()) return;
    //     try {
    //         setLoading(true);
    //         const response = await WalletAPI.executePaymentUsingCard(
    //             token,
    //             cardDetails,
    //             amountInfo.amount
    //         );
    //         setLoading(false);
    //         showSuccess(t("payment_successful"));
    //         redirect();
    //     } catch (err: any) {
    //         setLoading(false);
    //         if (err.response.status === 400) {
    //             showError(t("payment_failure"));
    //             console.log(err);
    //         }
    //     }
    // };
    // const executePaymentUsingToken = async () => {
    //     console.log("token");
    //     try {
    //         setLoading(true);
    //         const paymentToken: any = paymentMethods.find(
    //             (paymentMethod: any) =>
    //                 paymentMethod?.cardInfo?.number === selectedPaymentMethod
    //         );
    //         const response = await WalletAPI.executePaymentUsingToken(
    //             token,
    //             paymentToken?.token,
    //             amountInfo.amount
    //         );
    //         setLoading(false);
    //         showSuccess(t("payment_successful"));
    //         redirect();
    //     } catch (err: any) {
    //         setLoading(false);

    //         if (err.response.status === 400) {
    //             showError(t("payment_failure"));
    //         }
    //         showError(t("payment_failure"));
    //     }
    // };

    // const confirmPurchaseHandler = (e: any) => {
    //     e.preventDefault();
    //     if (selectedPaymentMethod === "") executeNewCreditCardPayment();
    //     else {
    //         executePaymentUsingToken();
    //     }
    // };
    return (
        <div>
            <NavBar index={3} />
            {loading ? (
                <div className="mx-auto mt-52 max-w-2xl px-4 pt-40 pb-24 sm:px-6 lg:max-w-7xl lg:px-8 ">
                    <LoadingSpinner />
                </div>
            ) : (
                <div
                    className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8"
                    dir={i18n.language === "ar" ? "rtl" : "ltr"}
                >
                    <div className="m-4">
                        <label
                            htmlFor="email-address"
                            className="block text-sm font-medium text-gray-700"
                        >
                            {t("amount")}
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                id="amount"
                                name="amount"
                                autoComplete="amount"
                                onChange={(e) => {
                                    if (isNaN(Number(e.target.value))) return;
                                    if (Number(e.target.value) > 9999999)
                                        return;
                                    setAmountInfo({
                                        ...amountInfo,
                                        amount: Number(e.target.value),
                                        total:
                                            Number(e.target.value) +
                                            amountInfo.fees,
                                    });
                                }}
                                value={
                                    amountInfo.amount !== 0
                                        ? amountInfo.amount
                                        : ""
                                }
                                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[#60b0bd] ${
                                    amountInfo.amount < 5
                                        ? "bg-red-50"
                                        : "bg-green-50"
                                } focus:ring-[#60b0bd] sm:text-sm`}
                            />
                            <p className="text-xs mt-2 text-gray-400">
                                {t("amount_greater_than_4")}
                            </p>
                        </div>
                    </div>
                    <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                        <div>
                            <div
                                className="mt-10 border-t border-gray-200 pt-10"
                                style={{
                                    opacity:
                                        selectedPaymentMethod === "" ? 1 : 0.4,
                                }}
                            >
                                {amountInfo.amount >= 5 && (
                                    <>
                                        <h2 className="text-lg font-medium text-gray-900">
                                            {t("choose_payment_method")}
                                        </h2>
                                        <div className="flex flex-wrap">
                                            {paymentMethods.map(
                                                (paymentMethod: any) => (
                                                    <div
                                                        key={
                                                            paymentMethod.PaymentMethodId
                                                        }
                                                        className="cursor-pointer  m-6 w-36 text-gray-600 border p-3"
                                                        onClick={() =>
                                                            redirectToPaymentURL(
                                                                paymentMethod.PaymentMethodId
                                                            )
                                                        }
                                                    >
                                                        <p className="text-center py-1">
                                                            {paymentMethod.PaymentMethodEn.toUpperCase()}
                                                        </p>
                                                        <img
                                                            src={
                                                                paymentMethod.ImageUrl
                                                            }
                                                            alt={
                                                                paymentMethod.PaymentMethodEn
                                                            }
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className="mt-10 lg:mt-0">
                            <h2 className="text-lg font-medium text-gray-900">
                                {t("summary")}
                            </h2>

                            <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                                <h3 className="sr-only">Items in your cart</h3>

                                <dl className="space-y-6 border-t border-gray-200 py-6 px-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm">
                                            {t("subtotal")}
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            $
                                            {amountInfo.amount
                                                .toString()
                                                .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ","
                                                )}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm">{t("fees")}</dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            ${amountInfo.fees}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                                        <dt className="text-base font-medium">
                                            {t("the_total")}
                                        </dt>
                                        <dd className="text-base font-medium text-gray-900">
                                            ${amountInfo.total}
                                        </dd>
                                    </div>
                                </dl>

                                {/* <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                    <button
                                        onClick={() => {}}
                                        disabled={amountInfo.amount < 5}
                                        className={`w-full rounded-md border border-transparent  ${
                                            amountInfo.amount < 5
                                                ? "bg-indigo-200"
                                                : "bg-[#60b0bd] hover:bg-[#58a1ad]"
                                        } py-3 px-4 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#60b0bd] focus:ring-offset-2 focus:ring-offset-gray-50`}
                                    >
                                        {t("confirm")}
                                    </button>
                                </div> */}
                            </div>
                            <br></br>
                            <div
                                style={{
                                    display: showErrorStatus ? "block" : "none",
                                }}
                            >
                                <InvalidInput content={message} />
                            </div>
                        </div>
                    </form>
                </div>
            )}
            <UpdateSuccess
                showSuccessUpdate={showSuccessStatus}
                setShowSuccessUpdate={setShowSuccessStatus}
                content={message}
            />
        </div>
    );
};

export default AddBalancePage;
