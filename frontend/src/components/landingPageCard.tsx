function LandingPageCard ({ icon, title, description } : { icon:React.ReactNode, title:string, description:string }) {
    return (
        <main className="flex flex-col justify-evenly w-full h-72 bg-white border border-gray-400 rounded-2xl px-8 box-border overflow-hidden hover:border-3 hover:border-[#008878] hover:scale-105 hover:shadow-[0_0_20px_0px_#00887870] transition-transform duration-700">
            <div className="relative flex justify-center items-center w-12 h-12 text-[white]  bg-linear-to-tr">
                <div className="absolute flex justify-center items-center w-12 h-12 text-[white]  bg-linear-to-tr from-[#008781] to-[#9affff] hover:bg-linear-to-bl transition-transform duration-500 rounded-full animate-spinGradient">

                </div>
                <div className="flex absolute">
{icon}
                </div>
            </div>

            <div className="font-bold">
                <h3>{title}</h3>
            </div>

            <div className="text-sm text-gray-500">
                <p>{description}</p>
            </div>
        </main>
    )
}

export default LandingPageCard