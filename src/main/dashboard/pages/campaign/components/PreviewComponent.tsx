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
        <div className="relative">
            <img
                src={preview}
                style={{
                    minWidth: "462px",
                    minHeight: "768px",
                }}
            />

            {!loading ? (
                <img
                    src={photoPath}
                    className={`absolute rounded-lg ${
                        i18n.language == "ar" ? "right-[118px]" : "left-[131px]"
                    }`}
                    style={{
                        height: "348px",
                        width: "213px",
                        top: "190px",
                        display: !photoPath ? "none" : "inherit",
                    }}
                />
            ) : (
                <div
                    style={{
                        height: "348px",
                        width: "213px",
                        top: "190px",
                        display: !photoPath ? "none" : "inherit",
                    }}
                    className={`absolute rounded-lg ${
                        i18n.language == "ar" ? "right-[118px]" : "left-[131px]"
                    } bg-gray-50 flex justify-center pt-[23%]`}
                >
                    <LoadingSpinner />
                </div>
            )}

            <img
                src={closeIcon}
                className={`absolute ${
                    i18n.language == "ar" ? "right-[120px]" : "left-[325px]"
                }`}
                style={{
                    height: "15px",
                    width: "15px",
                    top: "193px",
                    display: !photoPath ? "none" : "inherit",
                }}
            />
        </div>
    );
}

export default PreviewComponent;
