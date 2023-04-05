import { PlusIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

export default function AddBalanceButton() {
    const navigate = useNavigate();
    return (
        <button
            type="button"
            onClick={() => navigate("/dashboard/wallet/addbalance")}
            className="inline-flex items-center rounded-md border border-transparent bg-[#60b0bd] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-[#60b0bd] focus:ring-offset-2"
        >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Balance
        </button>
    );
}
