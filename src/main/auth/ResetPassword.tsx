import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import InvalidInput from "../../components/alerts/InvalidInput";
import { login } from "../../redux/auth/authSlice";
import { AppDispatch } from "../../redux/store";
import LoadingSpinner from "../../utils/LoadingSpinner";

type Props = {};

const ResetPassword = (props: Props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [queryParameters] = useSearchParams();
    const [errorMessage, setErrorMessage] = useState("");

    const [loading, setLoading] = useState(true);

    const [newPassword, setNewPassword] = useState({
        password: "",
        passwordConfirm: "",
    });

    const token = queryParameters.get("token");
    if (!token) navigate("/notfound");
    useEffect(() => {
        axios
            .post(`${process.env.REACT_APP_API_URL}/auth/verifyToken`, {
                resetToken: token,
            })
            .then((res) => {
                if (res.status === 200) {
                    setLoading(false);
                } else {
                    navigate("/notfound");
                }
            })
            .catch((err) => navigate("/notfound"));
    }, []);

    // handler
    const validPassword = new RegExp(
        "(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
    );
    const newPasswordHandler = async (e: any) => {
        e.preventDefault();
        if (!validPassword.test(newPassword.password))
            return setErrorMessage(
                "password must be at least eight characters long and contain numbers"
            );

        if (newPassword.password !== newPassword.passwordConfirm) {
            return setErrorMessage("passwords do not match!");
        }
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/newPassword`,
                {
                    resetToken: token,
                    newPassword: newPassword.password,
                }
            );
            dispatch(
                //@ts-ignore
                login({
                    email: response.data.data.user?.email,
                    password: newPassword.password,
                })
            );
            navigate("/reset/changed");
        } catch (err: any) {
            if (err?.response?.status === 400) {
                setLoading(false);
                return setErrorMessage("Cannot use that password!");
            }
            navigate("/notfound");
        }
    };

    return loading ? (
        <div style={{ marginTop: "200px" }}>
            <LoadingSpinner />
        </div>
    ) : (
        <>
            <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        className="mx-auto h-12 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Create a new password
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form
                            className="space-y-6"
                            action="#"
                            method="POST"
                            onChange={() => setErrorMessage("")}
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="password"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-[#60b0bd] focus:outline-none focus:ring-[#60b0bd] sm:text-sm"
                                        value={newPassword.password}
                                        onChange={(e) => {
                                            setNewPassword({
                                                ...newPassword,
                                                password: e.target.value,
                                            });
                                        }}
                                        style={{
                                            backgroundColor:
                                                errorMessage.includes(
                                                    "password"
                                                )
                                                    ? "#FEF2F2"
                                                    : "",
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    confirm password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-[#60b0bd] focus:outline-none focus:ring-[#60b0bd] sm:text-sm"
                                        value={newPassword.passwordConfirm}
                                        onChange={(e) =>
                                            setNewPassword({
                                                ...newPassword,
                                                passwordConfirm: e.target.value,
                                            })
                                        }
                                        style={{
                                            backgroundColor:
                                                errorMessage.includes(
                                                    "password"
                                                )
                                                    ? "#FEF2F2"
                                                    : "",
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-[#60b0bd] focus:ring-[#60b0bd]"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm text-gray-900"
                                    >
                                        Remember me
                                    </label>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md border border-transparent bg-[#60b0bd] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-[#60b0bd] focus:ring-offset-2"
                                    onClick={newPasswordHandler}
                                >
                                    Done
                                </button>
                            </div>
                        </form>
                        <br></br>
                        <InvalidInput content={errorMessage} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
