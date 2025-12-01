function CardDashboard ({ titulo, value }: { titulo: string, value: any } ) {
    return (
        <>
            <div className="text-white">
                <section className="flex justify-between items-center p-4 rounded-3xl bg-linear-to-tr from-[#00ffaa] to-[#008781] w-full h-[155px]">
                    <div>
                        <h2 className="font-medium w-full py-5">
                            {titulo}
                        </h2>
                        <p className="text-3xl font-bold">{value}</p>
                    </div>
                    <div className="flex justify-center items-center w-[50px] h-[50px] rounded-full bg-white opacity-[0.3]">
                        <img src="#" alt="Logo" />
                    </div>
                </section>
            </div>
        </>
    )
}

export default CardDashboard