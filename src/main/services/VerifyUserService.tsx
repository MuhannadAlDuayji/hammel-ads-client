import axios from "axios";

export default async function getUserInfo(
    token: string,
    navigate: any,
    setLoading: any
) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/users/getuser`,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            setLoading(false);
        }
    } catch (err: any) {
        console.log(err);
        if (err.response.status === 400) return navigate("/login");
        if (err.response.status === 401)
            return navigate("/dashboard/verifyemail");
    }
}
