import { Link } from "react-router-dom"

function NoProject () {
    return (
        <>
            <div className="flex flex-col justify-center items-center w-full border border-[#eeeeee] rounded-2xl shadow-[0_0_10px_0_#eeeeee] p-15">
                <div className="flex justify-center items-center w-[70px] h-[70px] bg-linear-to-tl from-[#2dd4cf] to-[#008781] rounded-full">
                    <img src="#" alt="Logo" />
                </div>
                <h2 className="font-bold my-5">No tienes proyectos todavía</h2>
                <p className="line-clamp-2">Comienza creando tu primer proyecto desde uno de nuestros templates</p>
                <Link to={'/dashboard/new-project'}>
                    <button className="mt-10 btn-primary hover:scale-105 duration-500">
                        Crear primer proyecto
                    </button>
                </Link>
                
            </div>
        </>
    )
}

export default NoProject