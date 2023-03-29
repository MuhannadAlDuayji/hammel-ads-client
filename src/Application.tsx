import React, { useEffect, useState } from "react";
import {
    BrowserRouter,
    Navigate,
    redirect,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";
import Login from "./main/auth/Login";
import Register from "./main/auth/Register";
import Home from "./main/Home";
import Dashboard from "./main/dashboard/pages/dashboard/Dashboard";
import Settings from "./main/dashboard/pages/settings/Settings";
import Analytics from "./main/dashboard/pages/analytics/Analytics";
import Campaigns from "./main/dashboard/pages/campaign/Campaigns";
import Wallet from "./main/dashboard/pages/wallet/Wallet";
import NotFoundPage from "./utils/NotFoundPage";
import ProtectedRoute from "./utils/ProtectedRoute";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./redux/store";
import ForgotPassword from "./main/auth/ForgotPassword";
import ResetPassword from "./main/auth/ResetPassword";
import SuccessModel from "./utils/SuccessModel";
import EmailSent from "./main/auth/EmailSent";
import VerifyEmailPage from "./main/auth/VerifyEmailPage";
import ConfirmEmail from "./main/auth/ConfirmEmail";
import axios from "axios";
import CreateCampaignPage from "./main/dashboard/pages/campaign/CreateCampaignPage";
import EditCampaignPage from "./main/dashboard/pages/campaign/EditCampaignPage";
import { saveUser } from "./redux/user/userSlice";
import ProtectedAdminRoute from "./utils/ProtectedAdminRoute";
import AdminEditCampaignPage from "./main/admin/pages/campaign/AdminEditCampaignPage";
import AdminCampaigns from "./main/admin/pages/campaign/AdminCampaigns";
import TransactionsManagement from "./main/admin/pages/transactions/TransactionsManagement";
import AdminSettings from "./main/admin/pages/settings/Settings";
import AddBalancePage from "./main/dashboard/pages/wallet/pages/AddBalancePage";
import { I18nextProvider } from "react-i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en.json";
import translationAR from "./locales/ar.json";
import i18n from "i18next";

export interface IApplicationProps {}

function AdminRoutes() {
    const token = useSelector((state: any) => state.auth.token);
    const user = useSelector((state: any) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (!token) navigate("/login");
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/users/getuser`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                if (!res.data.data.user?.isAdmin) return navigate("/notfound");

                dispatch(saveUser(res.data.data.user));
                localStorage.setItem(
                    "preferredLanguage",
                    res.data.data.user.preferredLanguage
                );
                i18n.changeLanguage(res.data.data.user.preferredLanguage);
            })
            .catch((err) => {
                if (err?.response?.status === 400) return navigate("/login");
                if (err?.response?.status === 401)
                    return navigate("/admin/verifyemail");
                navigate("/login");
            });
    }, []);
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
                path="/dashboard/*"
                element={
                    <Routes>
                        <Route path="/" element={<AdminCampaigns />} />
                        <Route
                            path="/campaigns/:id"
                            element={<AdminEditCampaignPage />}
                        />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                }
            />
            <Route path="/transactions" element={<TransactionsManagement />} />
            <Route path="/settings" element={<AdminSettings />} />

            <Route path="/verifyemail" element={<VerifyEmailPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

function MainRoutes() {
    const token = useSelector((state: any) => state.auth.token);
    const user = useSelector((state: any) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (!token) navigate("/login");
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/users/getuser`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                dispatch(saveUser(res.data.data.user));
                localStorage.setItem(
                    "preferredLanguage",
                    res.data.data.user.preferredLanguage
                );
                i18n.changeLanguage(res.data.data.user.preferredLanguage);
                if (res.data.data.user?.isAdmin)
                    return navigate("/admin/dashboard");
            })
            .catch((err) => {
                if (err?.response?.status === 400) return navigate("/login");
                if (err?.response?.status === 401)
                    return navigate("/dashboard/verifyemail");
                navigate("/login");
            });
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route
                path="/campaigns/*"
                element={
                    <Routes>
                        <Route path="/" element={<Campaigns />} />
                        <Route
                            path="/create"
                            element={<CreateCampaignPage />}
                        />
                        <Route path="/:id" element={<EditCampaignPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                }
            />
            <Route path="/wallet" element={<Wallet />} />
            <Route
                path="/wallet/*"
                element={
                    <Routes>
                        <Route path="/" element={<Wallet />} />
                        <Route
                            path="/addbalance"
                            element={<AddBalancePage />}
                        />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                }
            />
            <Route path="/settings" element={<Settings />} />

            <Route path="/verifyemail" element={<VerifyEmailPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

const Application: React.FunctionComponent<IApplicationProps> = (props) => {
    const [language] = useState(
        localStorage.getItem("preferredLanguage") || "ar"
    );

    const resources = {
        en: {
            translation: translationEN,
        },
        ar: {
            translation: translationAR,
        },
    };

    i18n.use(initReactI18next).init({
        resources,
        lng: language,
        fallbackLng: "ar",
    });

    return (
        <BrowserRouter>
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/confirm" element={<ConfirmEmail />} />

                        <Route
                            path="/forget/*"
                            element={
                                <Routes>
                                    <Route
                                        path="/"
                                        element={<ForgotPassword />}
                                    />
                                    <Route
                                        path="/sent"
                                        element={<EmailSent />}
                                    />
                                </Routes>
                            }
                        />
                        <Route path="/reset" element={<ResetPassword />} />

                        <Route
                            path="/dashboard/*"
                            element={
                                <ProtectedRoute>
                                    <MainRoutes />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/*"
                            element={
                                <ProtectedAdminRoute>
                                    <AdminRoutes />
                                </ProtectedAdminRoute>
                            }
                        />

                        <Route
                            path="/reset/*"
                            element={
                                <Routes>
                                    <Route
                                        path="/"
                                        element={<ResetPassword />}
                                    />
                                    <Route
                                        path="/changed"
                                        element={
                                            <SuccessModel
                                                title="Password Changed"
                                                description="your password have changed successfully"
                                                type="register"
                                            />
                                        }
                                    />
                                </Routes>
                            }
                        />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </I18nextProvider>
            </Provider>
        </BrowserRouter>
    );
};

export default Application;

/* 



*/
