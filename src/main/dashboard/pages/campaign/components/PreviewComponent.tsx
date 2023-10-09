import preview from "../../../../../images/PhonePreviewImage.png";
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
                        <img
                            src={photoPath}
                            className={`rounded-lg w-[70%]`}
                            style={{
                                display: !photoPath ? "none" : "inherit",
                            }}
                        />
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
