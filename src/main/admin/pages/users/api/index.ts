import axios from "axios";

const UsersAPI = {
    getAllUsers: function (token: string) {
        return axios.get(`${process.env.REACT_APP_API_URL}/users/getAllUsers`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    },
    getOneUser: function (token: string, userId: string) {
        return axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    },
    increaseBalance: function (
        userEmail: string,
        amount: number,
        token: string
    ) {
        return axios.post(
            `${process.env.REACT_APP_API_URL}/payments/increase-balance`,
            { userEmail: userEmail, amount: amount },
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );
    },
    updateDiscount: function (userId: string, discount: number, token: string) {
        return axios.post(
            `${process.env.REACT_APP_API_URL}/users/update-discount`,
            { userId: userId, discount },
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );
    },
};

export default UsersAPI;
