import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../../../utils/LoadingSpinner";
import AdminNavBar from "../../shared/AdminNavBar";
import UsersAPI from "./api";
import { useSelector } from "react-redux";
import IUser from "../../../../types/user";
import UsersTable from "./components/UsersTable";

type Props = {};

function UsersManagement({}: Props) {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);
    const token = useSelector((state: any) => state.auth.token);

    const getUsers = async () => {
        try {
            const { data } = await UsersAPI.getAllUsers(token);
            console.log(data.data);
            setUsers(data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <>
            <AdminNavBar index={1} />

            <div className="py-10">
                <header>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                            Users
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
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
                            <div className="px-4 py-8 sm:px-0">
                                <UsersTable users={users} />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

export default UsersManagement;
