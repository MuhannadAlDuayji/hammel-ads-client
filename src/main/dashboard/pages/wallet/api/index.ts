import axios from "axios";

const WalletAPI = {
    getPaymentMethods: function (token: string) {
        return axios.get(
            `${process.env.REACT_APP_API_URL}/payments/paymentMethods`,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );
    },
    getPaymentURL: function (
        token: string,
        invoiceValue: number,
        paymentMethodId: number
    ) {
        return axios.post(
            `${process.env.REACT_APP_API_URL}/payments/getPaymentURL`,
            {
                invoiceValue,
                paymentMethodId,
            },
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );
    },

    checkPayment: function (token: string, paymentId: string) {
        return axios.post(
            `${process.env.REACT_APP_API_URL}/payments/checkPayment`,
            {
                paymentId,
            },
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );
    },
    getTransactions: function (token: string) {
        return axios.get(
            `${process.env.REACT_APP_API_URL}/payments/transactions`,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );
    },
    // executePaymentUsingCard: function (
    //     token: string,
    //     cardDetails: any,
    //     amount: number
    // ) {
    //     return axios.post(
    //         `${process.env.REACT_APP_API_URL}/payments/newdirectpayment`,
    //         {
    //             cardDetails,
    //             amount,
    //         },
    //         {
    //             headers: {
    //                 authorization: `Bearer ${token}`,
    //             },
    //         }
    //     );
    // },
    // executePaymentUsingToken: function (
    //     token: string,
    //     paymentToken: string,
    //     amount: number
    // ) {
    //     return axios.post(
    //         `${process.env.REACT_APP_API_URL}/payments/directpayment`,
    //         {
    //             token: paymentToken,
    //             amount,
    //         },
    //         {
    //             headers: {
    //                 authorization: `Bearer ${token}`,
    //             },
    //         }
    //     );
    // },
    // removePaymentMethod: function (token: string, cardToken: string) {
    //     return axios.delete(
    //         `${process.env.REACT_APP_API_URL}/payments/paymentmethods`,
    //         {
    //             headers: {
    //                 authorization: `Bearer ${token}`,
    //             },
    //             data: {
    //                 token: cardToken,
    //             },
    //         }
    //     );
    // },
};

export default WalletAPI;
