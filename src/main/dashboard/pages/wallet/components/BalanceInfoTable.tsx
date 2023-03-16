import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveUser } from "../../../../../redux/user/userSlice";

type Props = {};

interface User {
    firstName: string;
    lastName: string;
    email: string;
    balance: number;
}

const BalanceInfoTable = (props: Props) => {
    const token = useSelector((state: any) => state.auth.token);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const language = i18n.language;
    const [user, setUser] = useState<User>({
        firstName: "-",
        lastName: "-",
        balance: 0,
        email: "-",
    });
    useEffect(() => {
        if (!user) return;
    }, [user]);
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/users/getuser`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                const user = res.data.data.user;
                setUser(user);
                dispatch(saveUser(user));
            });
    }, []);
    return (
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                        {t("full_name")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {`${user?.firstName} ${user?.lastName}`}
                    </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                        {t("email")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {user?.email}
                    </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                        {t("account_balance")}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        ${user?.balance?.toFixed(2)}
                    </dd>
                </div>
            </dl>
        </div>
    );
};

export default BalanceInfoTable;
