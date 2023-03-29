import preview from "../../../../../images/PhonePreviewImage.png";
import closeIcon from "../../../../../images/closeTabForPreview.png";
import { useTranslation } from "react-i18next";

type Props = {
    photoPath?: string;
};

function PreviewComponent({ photoPath }: Props) {
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
