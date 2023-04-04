import axios from "axios";

const UsersAPI = {
    getAllUsers: function (token: string) {
        return axios.get(`${process.env.REACT_APP_API_URL}/users/getAllUsers`, {
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
};

export default UsersAPI;
