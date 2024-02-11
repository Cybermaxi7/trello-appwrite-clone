"use client";

import { useBoardStore } from "@/store/BoardStore";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";

export default function Header() {
    const [loading, setLoading] = useState<Boolean>(false);
    const [suggestion, setSuggestion] = useState<String>("");
    const [board, searchString, setSearchString] = useBoardStore((state) => [
        state.board,
        state.searchString,
        state.setSearchString,
    ]);
    console.log(board.columns);

    // useEffect(() => {
    //     if (board.columns.size === 0) return;
    //     setLoading(true);

    //     async function fetchSuggestionFunc() {
    //         const suggestion = await fetchSuggestion(board);
    //         setSuggestion(suggestion);
    //         setLoading(false);
    //     }
    //     fetchSuggestionFunc();
    // }, [board]);

    return (
        <header>
            <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
                <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-br from-pink-400 to-[#0055d1] rounded-md filter blur-3xl opacity-50 -z-50" />
                <Image
                    src="https://links.papareact.com/c2cdd5"
                    alt="Trello Logo"
                    width={300}
                    height={100}
                    className="w-32 md:w-40 pb-10 md:pb-0 object-contain"
                />

                <div className="flex items-center space-x-5 flex-1 justify-end w-full ">
                    {/* Search Box */}
                    <form className="flex items-center space-x-5 bg-white rounded-md p-1 shadow-md flex-1 md:flex-initial">
                        <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 outline-none p-1"
                            value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                        />

                        <button type="submit" hidden>
                            {" "}
                            Search
                        </button>
                    </form>
                    {/* Avatar */}
                    <Avatar name="Moses Agbe" round color="#0055d1" size="40" />
                </div>
            </div>

            <div className="flex items-center justify-center px-5 py-2 md:py-4">
                <p className="flex items-center text-sm font-light pr-5 rounded-xl w-fit bg-white shadow-xl text-[#0055d1] italic max-w-3xl p-2">
                    <UserCircleIcon
                        className={`h-10 w-10 inline-block text-[#0055d1] mr-1 ${
                            loading && "animate-spin"
                        }`}
                    />
                    {suggestion && !loading
                        ? suggestion
                        : "GPT is summarizing your task for the day!"}
                </p>
            </div>
        </header>
    );
}
