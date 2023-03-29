import { useState } from "react";
import { useSelector } from "react-redux";
import TransactionsAPI from "../api";

type Props = {};

const IncreaseUserBalance = (props: Props) => {
    const token = useSelector((state: any) => state.auth.token);
    const [userEmail, setUserEmail] = useState("");
    const [amount, setAmount] = useState("");

    const addBalanceHandler = async (e: any) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount)) || !userEmail) {
            return;
        }

        try {
            const response = await TransactionsAPI.increaseBalance(
                userEmail,
                amount,
                token
            );

            setAmount("");
            setUserEmail("");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <form className="space-y-6" action="#" method="POST">
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                    User Email
                </label>
                <div className="mt-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm max-w-xl"
                    />
                </div>
            </div>
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
                        type="amount"
                        autoComplete="amount"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm max-w-xl"
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    onClick={addBalanceHandler}
                    className="flex w-full justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 max-w-xl"
                >
                    Add Balance
                </button>
            </div>
        </form>
    );
};

export default IncreaseUserBalance;
