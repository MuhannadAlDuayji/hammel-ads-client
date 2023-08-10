import { useState } from "react";
import { useSelector } from "react-redux";
import UsersAPI from "../api";
import IUser from "../../../../../types/user";

type Props = {
    user: IUser | null;
    setUser: any;
    selectedType: string;
};

const AddBalanceModal = ({ user, setUser, selectedType }: Props) => {
    const token = useSelector((state: any) => state.auth.token);
    const [amount, setAmount] = useState<number | undefined>();
    const [errorMessage, setErrorMessage] = useState("");

    const addBalanceHandler = async (e: any) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount)) || !user) {
            setErrorMessage("please enter a valid amount");
            return;
        }

        try {
            const response = await UsersAPI.increaseBalance(
                user.email,
                selectedType === "increase" ? amount : -amount,
                token
            );

            setAmount(undefined);
            setUser(null);
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
                                        Amount
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="amount"
                                            name="amount"
                                            type="string"
                                            autoComplete="amount"
                                            required
                                            value={amount || ""}
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
