import preview from "../../../../../images/PhonePreviewImage.png";
import testImage from "../../../../../images/testImage.png";

import closeIcon from "../../../../../images/closeTabForPreview.png";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../../../../utils/LoadingSpinner";

type Props = {
    photoPath?: string;
    loading: boolean;
};

function PreviewComponent({ photoPath, loading }: Props) {
    const { t, i18n } = useTranslation();
    return (
        <div className="relative ">
            <div className="relative w-[350px] my-4">
                <img src={preview} className="w-[100%] h-[100%]"></img>

                {!loading ? (
                    <div className="absolute h-[90%] w-[100%] top-[6.7%] flex justify-center items-center overflow-hidden ">
                        <div className="relative w-[70%] rounded-xl border-4 border-white">
                            <div className="opacity-40 w-[100%] h-10 absolute top-0 flex items-center justify-between px-4 text-white">
                                <div className="p-1 bg-black rounded-[50%] border-white border-[1px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </div>
                                <div className="bg-black  rounded-xl px-3 py-1 text-xs">
                                    اعلان
                                </div>
                            </div>

                            <img
                                src={photoPath || testImage}
                                className={`rounded-lg w-[100%]`}
                            />
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            height: "348px",
                            width: "213px",
                            top: "190px",
                            display: !photoPath ? "none" : "inherit",
                        }}
                        className={`absolute rounded-lg ${
                            i18n.language == "ar"
                                ? "right-[118px]"
                                : "left-[131px]"
                        } bg-gray-50 flex justify-center pt-[23%]`}
                    >
                        <LoadingSpinner />
                    </div>
                )}
            </div>
        </div>
    );
}

export default PreviewComponent;
