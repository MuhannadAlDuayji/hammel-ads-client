import { useState } from "react";
import { useSelector } from "react-redux";
import UsersAPI from "../api";
import IUser from "../../../../../types/user";
import { Disclosure } from "@headlessui/react";
import { Navigate } from "react-router-dom";
type Props = {
    user: IUser | null;
    setUser: any;
    selectedType: string;
};

const AddBalanceModal = ({ user, setUser, selectedType }: Props) => {
    const token = useSelector((state: any) => state.auth.token);
    const [amount, setAmount] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState("");

    const addBalanceHandler = async (e: any) => {
        e.preventDefault();
        if (isNaN(Number(amount)) || !user) {
            setErrorMessage("please enter a valid amount");
            return;
        }
        if (selectedType === "discount" && (amount > 100 || amount < 0)) {
            setErrorMessage("please enter a discount between 0 and 100");
            return;
        }

        try {
            if (selectedType === "discount") {
                const discount = amount / 100;
                const response = await UsersAPI.updateDiscount(
                    user._id,
                    discount,
                    token
                );
            } else {
                const response = await UsersAPI.increaseBalance(
                    user.email,
                    selectedType === "increase" ? amount : -amount,
                    token
                );
            }

            setAmount(0);
            setUser(null);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        user && (
            <div className="fixed z-50 inset-0 overflow-y-auto bg-gray-500 bg-opacity-50">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:max-w-lg">
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl">
                            <div
                                onClick={() => {
                                    setUser(null);
                                }}
                                className="mx-2 w-2 cursor-pointer"
                            >
                                x
                            </div>
                            <form
                                className="p-6 space-y-6"
                                action="#"
                                method="POST"
                                onChange={(e) => {
                                    e.preventDefault();
                                    setErrorMessage("");
                                }}
                            >
                                <div>
                                    <label
                                        htmlFor="amount"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        {selectedType === "discount"
                                            ? "Discount value (0 - 100)"
                                            : "Amount"}
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="amount"
                                            name="amount"
                                            type="string"
                                            value={amount}
                                            onChange={(e) => {
                                                const amount = Number(
                                                    e.target.value
                                                );
                                                if (isNaN(amount)) return;
                                                setAmount(amount);
                                            }}
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-[#60b0bd] focus:outline-none focus:ring-[#60b0bd] sm:text-sm max-w-xl"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        onClick={addBalanceHandler}
                                        className="flex w-full justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 max-w-xl"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                            {errorMessage && (
                                <div className="bg-red-50 py-2 text-red-800 text-center">
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default AddBalanceModal;
