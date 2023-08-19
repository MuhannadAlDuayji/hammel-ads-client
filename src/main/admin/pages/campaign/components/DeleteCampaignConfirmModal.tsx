import { useState } from "react";
import { useSelector } from "react-redux";
import CampaignsAPI from "../api";
import LoadingSpinner from "../../../../../utils/LoadingSpinner";

type Props = {
    selectedCampaignId: string;
    setSelectedCampaignId: any;
};

const DeleteCampaignConfirmModal = ({
    selectedCampaignId,
    setSelectedCampaignId,
}: Props) => {
    const token = useSelector((state: any) => state.auth.token);
    const [loading, setLoading] = useState(false);
    const deleteCampaign = async (campaignId: string) => {
        try {
            setLoading(true);
            const response = await CampaignsAPI.adminDeleteCampaign(
                token,
                campaignId
            );

            setSelectedCampaignId("");
            setLoading(false);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    return !selectedCampaignId ? (
        <></>
    ) : (
        <div className="fixed z-50 inset-0 overflow-y-auto bg-gray-500 bg-opacity-50">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:max-w-lg">
                    <div className="bg-white rounded-lg overflow-hidden shadow-xl p-5 h-32 flex items-center justify-center">
                        {loading ? (
                            <div className="">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <>
                                <p className="text-lg mb-4 mx-4">
                                    Are you sure you want to delete the
                                    campaign?
                                </p>
                                <div className="flex justify-end">
                                    <button
                                        className="mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() =>
                                            deleteCampaign(selectedCampaignId)
                                        }
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                        onClick={() =>
                                            setSelectedCampaignId("")
                                        }
                                    >
                                        No
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteCampaignConfirmModal;
