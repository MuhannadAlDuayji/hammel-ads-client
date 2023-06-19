import axios from "axios";

const CampaignsAPI = {
    getAllCampaigns: function (token: string) {
        return axios.get(`${process.env.REACT_APP_API_URL}/campaigns/`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    },
    getCampaignById: function (token: string, campaignId: string) {
        return axios.get(
            `${process.env.REACT_APP_API_URL}/campaigns/${campaignId}`,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );
    },
    getCountryList: function (token: string) {
        return axios.get(
            `${process.env.REACT_APP_API_URL}/campaigns/country-list`,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );
    },
    createCampaign: function (data: any, token: string) {
        return axios.post(`${process.env.REACT_APP_API_URL}/campaigns/`, data, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    },
    updateCampaign: function (
        updateInfo: any,
        campaignId: string,
        token: string
    ) {
        return axios.patch(
            `${process.env.REACT_APP_API_URL}/campaigns/${campaignId}`,
            updateInfo,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );
    },

    getUser: function (token: string, userId: string) {
        return axios.get(
            `${process.env.REACT_APP_API_URL}/users/${userId}`,

            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );
    },

    uploadCampaignPhoto: function (campaignPhotoData: FormData, token: string) {
        return axios.post(
            `${process.env.REACT_APP_API_URL}/campaigns/upload-campaign-photo`,
            campaignPhotoData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    authorization: `Bearer ${token}`,
                },
            }
        );
    },
};

export default CampaignsAPI;
