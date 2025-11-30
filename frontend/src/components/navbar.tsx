function Navbar () {
    return (
        <>
            <nav className="fixed z-10 flex justify-center items-center w-full h-[70px] bg-white shadow-md px-20">
                <div className="flex items-center container h-full">
                    <section>
                        <img src="" alt="Logo" />
                    </section>

                    <section className="flex justify-center items-center w-full">
                        <ol className="flex gap-10">
                            <ul className="hover:text-[#3ab8b0]">
                                <a href="#">Hosting</a>
                            </ul>
                            <ul className="hover:text-[#3ab8b0]">
                                <a href="#">Dominios</a>
                            </ul>
                            <ul className="hover:text-[#3ab8b0]">
                                <a href="#">Documentación</a>
                            </ul>
                            <ul className="hover:text-[#3ab8b0]">
                                <a href="#">Contacto</a>
                            </ul>
                        </ol>

                    </section>

                    <section>
                        <button className="cursor-pointer px-5 py-2 btn-primary text-white font-medium ">
                            Login
                        </button>
                    </section>
                </div>
            </nav>
        </>
    )
}

export default Navbar