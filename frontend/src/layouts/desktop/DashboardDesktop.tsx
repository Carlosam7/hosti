import { BiPlus } from "react-icons/bi";
import CardWelcome from "../../components/CardWelcome";
import CardDashboard from "../../components/CardDashboard";
import CardProject from "../../components/CardProject";
import useScreenWidth from "../../hooks/useScreenWidth";
import { useEffect, useState } from "react";

function DashboardDesktop () {
    const w = useScreenWidth();
    const [ancho, setAncho] = useState("");


    useEffect(() => {
        const tamaño = w/4
        if (tamaño < 320) {
            setAncho("grid grid-cols-1")
            console.log('Este es el tamaño: ', tamaño)
        } else {
            setAncho("grid grid-cols-4")
    }
    console.log(w/4)
    }, [w])
    return (
        <>
            <div className="flex flex-col justify-start items-center w-full min-h-screen bg-background pt-[170px] px-15">
                {/* Main Content */}
                <main className="flex flex-col w-full container mx-auto gap-16">

                    <section className="grid grid-cols-4 gap-3 w-full">
                        <CardWelcome/>
                        <CardDashboard titulo={"Total de proyectos"} value={"1"}/>
                        <CardDashboard titulo={"Template más usado"} value={"1"}/>
                        <CardDashboard titulo={"Último proyecto"} value={"1"}/>
                    </section>
                    
                    {/* Title Section */}
                    <section className="flex items-start justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Mis Proyectos</h1>
                            <p className="text-muted-foreground">Gestiona todos tus proyectos creados desde templates</p>
                        </div>
                        {/* <Link href="/dashboard/new-project"> */}
                            <button className="flex justify-center items-center gap-4 btn-outline" 
                                onClick={ () => {
                                    window.location.href = '/new-project'
                                }}>
                                <BiPlus className="h-4 w-4" />
                                Nuevo Proyecto
                            </button>
                        {/* </Link> */}
                    </section>

                    {/* Project Section */}
                    <section className={`${ancho} justify-center gap-3`}>
                        <CardProject color={"shadow-[0_0_5px_0px_#61dbfb]"}/>
                        <CardProject color={"shadow-[0_0_5px_0px_#E34C26]"}/>
                        <CardProject color={"shadow-[2px_2px_2px_0px_#306998,-2px_-2px_2px_0px_#ffd43b]"}/>
                        <CardProject color={"shadow-[0_0_5px_0px_#61dbfb]"}/>
                    </section>

                </main>
            </div>
        </>
    )
}
export default DashboardDesktop