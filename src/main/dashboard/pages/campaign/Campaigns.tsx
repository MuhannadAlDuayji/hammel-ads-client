import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../../../utils/LoadingSpinner";
import NavBar from "../../shared/NavBar";
import CampaignsAPI from "./api";
import CampaignsTable from "./components/CampaignsTable";

type CampaignsProps = {};

export default function Campaigns({}: CampaignsProps) {
    const token = useSelector((state: any) => state.auth.token);
    const { t, i18n } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [campaigns, setCampaigns] = useState([]);

    const getCampaigns = async () => {
        try {
            const response = await CampaignsAPI.getAllCampaigns(token);
            const campaigns = response.data.data.reverse();
            setCampaigns(campaigns);
            setCampaigns(response.data.data);
            setLoading(false);
        } catch (err: any) {
            console.log(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        getCampaigns();
    }, []);

    return (
        <>
            <NavBar index={2} />
            {loading ? (
                <div
                    style={{
                        width: "100%",
                        height: "90vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <LoadingSpinner />
                </div>
            ) : (
                <div
                    className="mx-auto max-w-7xl sm:px-6 lg:px-8 sm:flex-row px-4 mt-10"
                    dir={i18n.language === "ar" ? "rtl" : "ltr"}
                >
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-xl font-semibold text-gray-900">
                                {t("campaigns")}
                            </h1>
                            <p className="mt-2 text-sm text-gray-700">
                                {t("a_list_of_all_campaigns")}
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <Link
                                to={"/dashboard/campaigns/create"}
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#60b0bd] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-[#60b0bd] focus:ring-offset-2 sm:w-auto"
                            >
                                {t("add_campaign")}
                            </Link>
                        </div>
                    </div>
                    <CampaignsTable campaigns={campaigns} />
                </div>
            )}
        </>
    );
}
