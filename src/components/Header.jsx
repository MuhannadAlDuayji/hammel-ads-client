import { Fragment } from "react";

import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";

import { Container } from "./Container";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

function MobileNavLink({ href, children }) {
    return (
        <button href={href} className="block w-full p-2">
            {children}
        </button>
    );
}

function MobileNavIcon({ open }) {
    return (
        <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
        >
            <path
                d="M0 1H14M0 7H14M0 13H14"
                className={clsx(
                    "origin-center transition",
                    open && "scale-90 opacity-0"
                )}
            />
            <path
                d="M2 2L12 12M12 2L2 12"
                className={clsx(
                    "origin-center transition",
                    !open && "scale-90 opacity-0"
                )}
            />
        </svg>
    );
}

function MobileNavigation() {
    return (
        <Popover>
            <button
                className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
                aria-label="Toggle Navigation"
            >
                {({ open }) => <MobileNavIcon open={open} />}
            </button>
            <Transition.Root>
                <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-100 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Popover.Panel
                        as="div"
                        className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
                    >
                        <MobileNavLink href="#features">Features</MobileNavLink>
                        <MobileNavLink href="#testimonials">
                            Testimonials
                        </MobileNavLink>
                        <MobileNavLink href="#pricing">Pricing</MobileNavLink>
                        <hr className="m-2 border-slate-300/40" />
                        <MobileNavLink href="/login">Sign in</MobileNavLink>
                    </Popover.Panel>
                </Transition.Child>
            </Transition.Root>
        </Popover>
    );
}

export function Header() {
    const { t, i18n } = useTranslation();
    return (
        <header className="py-10">
            <Container>
                <nav className="relative z-5 flex justify-between items-center">
                    <div className="h-full flex items-center pb-2">
                        <LanguageSwitcher />
                    </div>

                    {/* <div className="flex items-center gap-x-5 md:gap-x-8">
                        <div className="hidden md:block">
                            <Link to="/login">{t("sign_in")}</Link>
                        </div>
                        <Button href="/register" color="blue">
                            <span>{t("get_started_today")}</span>
                        </Button>
                    </div> */}
                </nav>
            </Container>
        </header>
    );
}
