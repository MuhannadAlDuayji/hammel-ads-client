import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    const { t } = useTranslation();
    return (
        <>
            <div className="min-h-full bg-white py-16 px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
                <div className="mx-auto max-w-max">
                    <main className="sm:flex">
                        <p className="text-4xl font-bold tracking-tight text-indigo-600 sm:text-5xl">
                            404
                        </p>
                        <div className="sm:ml-6">
                            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                    {t("page_not_found_title")}
                                </h1>
                                <p className="mt-1 text-base text-gray-500">
                                    {t("page_not_found_message")}
                                </p>
                            </div>
                            <div className="mt-10 fles space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                                <Link
                                    to={"/"}
                                    className="inline-flex items-cente rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    {t("page_not_found_cta")}
                                </Link>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
