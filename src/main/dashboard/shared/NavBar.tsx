import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import logo from "../../../images/logos/hammeladslogo.png";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

interface NavBarProps {
    index: number;
}
export default function NavBar({ index }: NavBarProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const token = useSelector((state: any) => state.auth.token);
    const user = useSelector((state: any) => state.user.user);

    const navigation = [
        { name: t("dashboard"), href: "/dashboard", current: false },
        { name: t("analytics"), href: "/dashboard/analytics", current: false },
        { name: t("campaigns"), href: "/dashboard/campaigns", current: false },
        { name: t("wallet"), href: "/dashboard/wallet", current: false },
        { name: t("support"), href: "/dashboard/support", current: false },
    ];
    const userNavigation = [{ name: t("settings") }, { name: t("logout") }];

    navigation.forEach((el) => (el.current = false));
    if (index < navigation.length && index >= 0)
        navigation[index].current = true;

    const logoutHandler = () => {
        //@ts-ignore
        dispatch(logout());
        navigate("/");
    };

    if (typeof token === "object") {
        navigate("/login");
        return <></>;
    }

    return (
        <>
            <div
                className="min-h-full sticky top-0 z-50 opacity-95 "
                dir={i18n.language === "ar" ? "rtl" : "ltr"}
            >
                <Disclosure
                    as="nav"
                    className="border-b border-gray-200 bg-white"
                >
                    {({ open }) => (
                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-16 lg:px-34">
                                <div className="flex h-16 justify-between">
                                    <div className="flex">
                                        <div
                                            className={`flex items-center ${
                                                i18n.language === "ar"
                                                    ? "pl-8"
                                                    : "pr-8"
                                            }`}
                                        >
                                            <img
                                                src={logo}
                                                alt="Website Logo"
                                                className="h-8"
                                            />
                                        </div>

                                        <div className="hidden sm:-my-px  sm:flex gap-6 ">
                                            {navigation.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? "border-[#60b0bd] text-gray-900"
                                                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                                        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                                    )}
                                                    aria-current={
                                                        item.current
                                                            ? "page"
                                                            : undefined
                                                    }
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex sm:items-center">
                                        <Menu as="div" className="relative m-3">
                                            <div>
                                                <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#60b0bd] focus:ring-offset-2">
                                                    <span className="sr-only">
                                                        Open user menu
                                                    </span>
                                                    {user?.photoPath ? (
                                                        <img
                                                            className="h-10 w-10 rounded-full"
                                                            src={
                                                                user?.photoPath
                                                            }
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <svg
                                                            className="h-8 w-8 rounded-full"
                                                            fill="#6B7280"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                        </svg>
                                                    )}
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-200"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <Menu.Item key={"settings"}>
                                                        {({ active }) => (
                                                            <Link
                                                                to={
                                                                    "/dashboard/settings"
                                                                }
                                                                className={classNames(
                                                                    active
                                                                        ? "bg-gray-100"
                                                                        : "",
                                                                    "block px-4 py-2 text-sm text-gray-700"
                                                                )}
                                                            >
                                                                {t("settings")}
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item key={"logout"}>
                                                        {({ active }) => (
                                                            <a
                                                                onClick={
                                                                    logoutHandler
                                                                }
                                                                className={classNames(
                                                                    active
                                                                        ? "bg-gray-100"
                                                                        : "",
                                                                    "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                                                )}
                                                            >
                                                                {t("logout")}
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                    <div className="-mr-2 flex items-center sm:hidden">
                                        {/* Mobile menu button */}
                                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#60b0bd] focus:ring-offset-2">
                                            <span className="sr-only">
                                                Open main menu
                                            </span>
                                            {open ? (
                                                <XMarkIcon
                                                    className="block h-6 w-6"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <Bars3Icon
                                                    className="block h-6 w-6"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </div>

                            <Disclosure.Panel className="sm:hidden">
                                <div className="space-y-1 pt-2 pb-3">
                                    {navigation.map((item) => (
                                        <Disclosure.Button
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            className={classNames(
                                                item.current
                                                    ? "bg-indigo-50 border-[#60b0bd] text-[#58a1ad]"
                                                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                                                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                            )}
                                            aria-current={
                                                item.current
                                                    ? "page"
                                                    : undefined
                                            }
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    ))}
                                </div>
                                <div className="border-t border-gray-200 pt-4 pb-3">
                                    <div className="flex items-center px-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                crossOrigin="anonymous"
                                                src={user?.photoPath}
                                                alt=""
                                            />
                                        </div>
                                        <div className="mx-3">
                                            <div className="text-sm font-medium text-gray-500">
                                                {user?.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 space-y-1">
                                        {userNavigation.map((item) => (
                                            <Disclosure.Button
                                                key={item.name}
                                                as="a"
                                                onClick={() => {
                                                    if (
                                                        item.name
                                                            .toLocaleLowerCase()
                                                            .includes("sign")
                                                    ) {
                                                        //@ts-ignore
                                                        dispatch(logout());
                                                        navigate("/");
                                                    } else {
                                                        navigate(
                                                            "/dashboard/settings"
                                                        );
                                                    }
                                                }}
                                                className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                            >
                                                {item.name}
                                            </Disclosure.Button>
                                        ))}
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            </div>
        </>
    );
}
