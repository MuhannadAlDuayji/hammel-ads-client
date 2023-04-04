/*
      This example requires some changes to your config:
      
      ```
      // tailwind.config.js
      module.exports = {
        // ...
        plugins: [
          // ...
          require('@tailwindcss/forms'),
        ],
      }
      ```
    */
import { useEffect, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { useTranslation } from "react-i18next";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

interface Language {
    id: number;
    value: string;
    name: string;
}

export default function LanguageSwitcher() {
    const [query, setQuery] = useState("");
    const { t, i18n } = useTranslation();
    const languages: Language[] = [
        { id: 1, value: "ar", name: "Arabic" },
        { id: 2, value: "en", name: "English" },
    ];

    let language = languages.find(
        (language: Language) =>
            language.value === localStorage.getItem("preferredLanguage")
    );
    if (!language) language = languages[0];
    const [selectedLanguage, setSelectedLanguage] =
        useState<Language>(language);

    const filteredLanguages =
        query === ""
            ? languages
            : languages.filter((language: Language) => {
                  return language.name
                      .toLowerCase()
                      .includes(query.toLowerCase());
              });

    useEffect(() => {
        i18n.changeLanguage(selectedLanguage.value);
        localStorage.setItem("preferredLanguage", selectedLanguage.value);
    }, [selectedLanguage]);

    return (
        <Combobox
            as="div"
            value={selectedLanguage}
            onChange={setSelectedLanguage}
        >
            <div className="relative mt-2">
                <Combobox.Input
                    className="w-28 rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    disabled={true}
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(language: Language) => language?.name}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    />
                </Combobox.Button>

                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredLanguages.map((language) => (
                        <Combobox.Option
                            key={language.id}
                            value={language}
                            className={({ active }) =>
                                classNames(
                                    "relative cursor-default select-none py-2 pl-3 pr-9",
                                    active
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-900"
                                )
                            }
                        >
                            {({ active, selected }) => (
                                <>
                                    <span
                                        className={classNames(
                                            "block truncate",
                                            selected && "font-semibold"
                                        )}
                                    >
                                        {language.name}
                                    </span>

                                    {selected && (
                                        <span
                                            className={classNames(
                                                "absolute inset-y-0 right-0 flex items-center pr-4",
                                                active
                                                    ? "text-white"
                                                    : "text-indigo-600"
                                            )}
                                        >
                                            <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    )}
                                </>
                            )}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </div>
        </Combobox>
    );
}
