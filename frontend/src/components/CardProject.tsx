import { FaReact } from "react-icons/fa"
import { GrReactjs } from "react-icons/gr"
import useScreenWidth from "../hooks/useScreenWidth"
import { useEffect, useState } from "react";

function CardProject ({color}: {color: string}) {
    return (
        <>
            <div className={`felx justify-center items-center w-full rounded-2xl ${color} p-5`}>
                <main className="flex flex-col">
                    <section className="flex justify-between w-full">
                        <h2>Name of project 1</h2>
                        <div className="rounded-full bg-[#6ddbd7] px-4 py-1 text-white">
                            <p> Active </p>
                        </div>
                    </section>

                    <section>

                    </section>

                    <section>

                    </section>
                </main>
            </div>
        </>
    )
}

export default CardProject