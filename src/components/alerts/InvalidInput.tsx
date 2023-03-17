import { XCircleIcon } from "@heroicons/react/20/solid";

interface InvalidInputProps {
    content?: string;
}

export default function InvalidInput({ content }: InvalidInputProps) {
    return (
        <div
            className="rounded-md bg-red-50 p-4"
            style={{ display: content === "" ? "none" : "block" }}
        >
            <div className="flex">
                <div className="flex-shrink-0">
                    <XCircleIcon
                        className="h-5 w-5 text-red-400"
                        aria-hidden="true"
                    />
                </div>
                <div className="mx-3">
                    <h3 className="text-sm font-medium text-red-800 text-left">
                        {content}
                    </h3>
                </div>
            </div>
        </div>
    );
}
