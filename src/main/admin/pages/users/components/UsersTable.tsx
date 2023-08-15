import { useState } from "react";
import IUser from "../../../../../types/user";
import AddBalanceModal from "./AddBalanceModal";

interface Props {
    users: IUser[];
}
function formatNumber(number: number) {
    return Number(
        number
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
}
export default function UsersTable({ users }: Props) {
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [selectedType, setSelectedType] = useState<string>("increase");

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                    >
                                        Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Balance
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Discount
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {users.map((user) => (
                                    <tr key={user.email}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    {user?.photoPath ? (
                                                        <img
                                                            className="h-10 w-10 rounded-full"
                                                            src={user.photoPath}
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <svg
                                                            className="h-10 w-10 rounded-full"
                                                            fill="#6B7280"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    {user.firstName}{" "}
                                                    {user.lastName}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {user.email}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            $
                                            {formatNumber(user.balance).toFixed(
                                                2
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {user.discount * 100}%
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                            <button
                                                className="text-white bg-green-600 hover:bg-green-700 py-2 px-2 rounded-lg"
                                                onClick={() => {
                                                    setSelectedType("increase");
                                                    setSelectedUser(user);
                                                }}
                                            >
                                                Charge
                                            </button>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                            <button
                                                className="text-white bg-red-600 hover:bg-red-700 py-2 px-2  rounded-lg"
                                                onClick={() => {
                                                    setSelectedType("decrease");
                                                    setSelectedUser(user);
                                                }}
                                            >
                                                Subtract
                                            </button>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                            <button
                                                className="text-white bg-blue-700 hover:bg-bl-800 py-2 px-2  rounded-lg"
                                                onClick={() => {
                                                    setSelectedType("discount");
                                                    setSelectedUser(user);
                                                }}
                                            >
                                                Discount
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <AddBalanceModal
                            setUser={setSelectedUser}
                            selectedType={selectedType}
                            user={selectedUser}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
