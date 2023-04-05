import { PlusIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

export default function NewPaymentMethodButton() {
    const navigate = useNavigate();
    return (
        <button
            type="button"
            onClick={() => navigate("/dashboard/wallet/addbalance")}
            className="inline-flex items-center rounded-md border border-transparent bg-[#60b0bd] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#58a1ad] focus:outline-none focus:ring-2 focus:ring-[#60b0bd] focus:ring-offset-2"
        >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Payment Method
        </button>
    );
}
