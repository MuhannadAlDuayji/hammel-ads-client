import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../utils/LoadingSpinner";
import SuccessModel from "../../utils/SuccessModel";

type Props = {};

const ConfirmEmail = (props: Props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [queryParameters] = useSearchParams();

    const [loading, setLoading] = useState(true);

    const token = queryParameters.get("token");
    if (!token) navigate("/notfound");
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/auth/confirm/${token}`)
            .then((res) => {
                if (res.status === 200) {
                    setLoading(false);
                } else {
                    navigate("/notfound");
                }
            })
            .catch((err) => navigate("/notfound"));
    }, []);

    return loading ? (
        <div style={{ marginTop: "200px" }}>
            <LoadingSpinner />
        </div>
    ) : (
        <>
            <SuccessModel
                title={t("email_confirmed")}
                description={t("email_confirmed_description")}
            />
        </>
    );
};

export default ConfirmEmail;
