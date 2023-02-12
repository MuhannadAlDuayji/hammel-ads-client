import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WalletAPI from "../api";
import CreditCardView from "../components/CreditCardView";
import LoadingSpinner from "../../../../../utils/LoadingSpinner";
import UpdateSuccess from "../../../shared/UpdateSuccess";
import { useNavigate } from "react-router-dom";
import InvalidInput from "../../../../../components/alerts/InvalidInput";
const paymentOptions = [
    { id: "credit-card", title: "Mastercard/Visa" },
    { id: "paypal", title: "PayPal" },
    { id: "etransfer", title: "eTransfer" },
];

const AddBalancePage = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

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

    const [paymentMethods, setPaymentMethods] = useState([]);

    const token = useSelector((state: any) => state.auth.token);
    const navigate = useNavigate();

    const getMethods = async () => {
        try {
            const response = await WalletAPI.getAllPaymentMethods(token);
            const paymentMethodsArray = response.data.data;
            setPaymentMethods(paymentMethodsArray);
            console.log(response.data.data);

            if (paymentMethodsArray.length > 0) {
                setSelectedPaymentMethod(
                    paymentMethodsArray[0].cardInfo.number
                );
            }
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
    console.log("methods", paymentMethods);
    const executeNewCreditCardPayment = async () => {
        try {
            setLoading(true);
            const response = await WalletAPI.executePaymentUsingCard(
                token,
                cardDetails,
                amountInfo.amount
            );
            setLoading(false);
            showSuccess(response.data.message);
            console.log("resssssssss", response);
            redirect();
        } catch (err: any) {
            setLoading(false);
            if (err.response.status === 400) {
                showError(err.response.data.message);
                console.log(err);
            }
        }
    };
    const executePaymentUsingToken = async () => {
        try {
            setLoading(true);
            const paymentToken: any = paymentMethods.find(
                (paymentMethod: any) =>
                    paymentMethod?.cardInfo?.number === selectedPaymentMethod
            );
            console.log("payment token", paymentToken);
            const response = await WalletAPI.executePaymentUsingToken(
                token,
                paymentToken?.token,
                amountInfo.amount
            );
            setLoading(false);
            console.log("resssssssss", response);
            showSuccess(response.data.message);
            redirect();
        } catch (err: any) {
            setLoading(false);
            if (err.response.status === 400) {
                showError(err.response.data.message);
            }
        }
    };

    const confirmPurchaseHandler = (e: any) => {
        e.preventDefault();
        if (selectedPaymentMethod === "") executeNewCreditCardPayment();
        else {
            executePaymentUsingToken();
        }
    };
    console.log("selected", selectedPaymentMethod);
    return (
        <div className="bg-gray-50">
            {loading ? (
                <div className="mx-auto max-w-2xl px-4 pt-40 pb-24 sm:px-6 lg:max-w-7xl lg:px-8 ">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="m-4">
                        <label
                            htmlFor="email-address"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Amount
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
                                value={amountInfo.amount}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                        <div>
                            <div className="mt-10 border-t border-gray-200 pt-10">
                                <h1>your payment methods</h1>
                                <br></br>

                                <h4>
                                    {paymentMethods.length === 0 &&
                                        "you don't have any payment methods yet"}
                                </h4>
                                <ul>
                                    {paymentMethods.map(
                                        (paymentMethod: any) => (
                                            // <div
                                            //     style={{
                                            //         backgroundColor:
                                            //             selectedPaymentMethod.number ===
                                            //             paymentMethod.number
                                            //                 ? "blue"
                                            //                 : "",
                                            //         width: "262px",
                                            //         display: "flex",
                                            //         justifyContent: "center",
                                            //         alignItems: "center",

                                            //         padding: "3px",
                                            //         margin: "5px",
                                            //     }}
                                            // >
                                            <CreditCardView
                                                key={paymentMethod.token}
                                                cardInfo={
                                                    paymentMethod.cardInfo
                                                }
                                                setSelectedPaymentMethod={
                                                    setSelectedPaymentMethod
                                                }
                                                selectedPaymentMethod={
                                                    selectedPaymentMethod
                                                }
                                            />
                                            // </div>
                                        )
                                    )}
                                </ul>
                            </div>

                            {/* Payment */}
                            <div
                                className="mt-10 border-t border-gray-200 pt-10"
                                style={{
                                    opacity:
                                        selectedPaymentMethod === "" ? 1 : 0.4,
                                }}
                            >
                                <h2 className="text-lg font-medium text-gray-900">
                                    New Payment Method
                                </h2>

                                <fieldset className="mt-4">
                                    <legend className="sr-only">
                                        Payment type
                                    </legend>
                                    <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                        {paymentOptions.map(
                                            (
                                                paymentMethod: any,
                                                paymentMethodIdx: number
                                            ) => (
                                                <div
                                                    key={paymentMethod.id}
                                                    className="flex items-center"
                                                >
                                                    {paymentMethodIdx === 0 ? (
                                                        <input
                                                            id={
                                                                paymentMethod.id
                                                            }
                                                            name="payment-type"
                                                            type="radio"
                                                            defaultChecked
                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                    ) : (
                                                        <input
                                                            id={
                                                                paymentMethod.id
                                                            }
                                                            name="payment-type"
                                                            type="radio"
                                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                    )}

                                                    <label
                                                        htmlFor={
                                                            paymentMethod.id
                                                        }
                                                        className="ml-3 block text-sm font-medium text-gray-700"
                                                    >
                                                        {paymentMethod.title}
                                                    </label>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </fieldset>

                                <div className="mt-6 grid grid-cols-4 gap-y-6 gap-x-4">
                                    <div className="col-span-4">
                                        <label
                                            htmlFor="card-number"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Card number
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="card-number"
                                                name="card-number"
                                                autoComplete="cc-number"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={cardDetails.Number}
                                                onFocus={() =>
                                                    setSelectedPaymentMethod("")
                                                }
                                                onChange={(e) => {
                                                    if (
                                                        isNaN(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    )
                                                        return;

                                                    setCardDetails({
                                                        ...cardDetails,
                                                        Number: e.target.value,
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-4">
                                        <label
                                            htmlFor="name-on-card"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Name on card
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="name-on-card"
                                                name="name-on-card"
                                                autoComplete="cc-name"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={cardDetails.HolderName}
                                                onFocus={() =>
                                                    setSelectedPaymentMethod("")
                                                }
                                                onChange={(e) => {
                                                    setCardDetails({
                                                        ...cardDetails,
                                                        HolderName:
                                                            e.target.value,
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-1">
                                        <label
                                            htmlFor="expiration-date"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Expiry Month
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="expiration-date"
                                                id="expiration-date"
                                                autoComplete="cc-exp"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={cardDetails.ExpiryMonth}
                                                onFocus={() =>
                                                    setSelectedPaymentMethod("")
                                                }
                                                onChange={(e) => {
                                                    if (
                                                        isNaN(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    )
                                                        return;

                                                    if (
                                                        e.target.value.length >
                                                        2
                                                    )
                                                        return;

                                                    setCardDetails({
                                                        ...cardDetails,
                                                        ExpiryMonth:
                                                            e.target.value,
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <label
                                            htmlFor="expiration-date"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Expiry Year
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="expiration-date"
                                                id="expiration-date"
                                                autoComplete="cc-exp"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={cardDetails.ExpiryYear}
                                                onFocus={() =>
                                                    setSelectedPaymentMethod("")
                                                }
                                                onChange={(e) => {
                                                    if (
                                                        isNaN(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    )
                                                        return;
                                                    if (
                                                        e.target.value.length >
                                                        2
                                                    )
                                                        return;
                                                    setCardDetails({
                                                        ...cardDetails,
                                                        ExpiryYear:
                                                            e.target.value,
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <label
                                            htmlFor="cvc"
                                            className="block text-sm font-medium text-gray-70"
                                        >
                                            Security Code
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="cvc"
                                                id="cvc"
                                                autoComplete="csc"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={cardDetails.SecurityCode}
                                                onFocus={() =>
                                                    setSelectedPaymentMethod("")
                                                }
                                                onChange={(e) => {
                                                    if (
                                                        isNaN(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    )
                                                        return;
                                                    if (
                                                        e.target.value.length >
                                                        3
                                                    )
                                                        return;
                                                    setCardDetails({
                                                        ...cardDetails,
                                                        SecurityCode:
                                                            e.target.value,
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className="mt-10 lg:mt-0">
                            <h2 className="text-lg font-medium text-gray-900">
                                summary
                            </h2>

                            <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                                <h3 className="sr-only">Items in your cart</h3>

                                <dl className="space-y-6 border-t border-gray-200 py-6 px-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm">Subtotal</dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            ${amountInfo.amount}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm">fees</dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            ${amountInfo.fees}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                                        <dt className="text-base font-medium">
                                            Total
                                        </dt>
                                        <dd className="text-base font-medium text-gray-900">
                                            ${amountInfo.total}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                    <button
                                        onClick={confirmPurchaseHandler}
                                        disabled={amountInfo.amount < 5}
                                        className={`w-full rounded-md border border-transparent  ${
                                            amountInfo.amount < 5
                                                ? "bg-indigo-200"
                                                : "bg-indigo-600 hover:bg-indigo-700"
                                        } py-3 px-4 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50`}
                                    >
                                        Confirm
                                    </button>
                                </div>
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
