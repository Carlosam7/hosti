import { BiPlus } from "react-icons/bi";
import CardWelcome from "../../components/CardWelcome";
import CardDashboard from "../../components/CardDashboard";
import CardProject from "../../components/CardProject";
import useScreenWidth from "../../hooks/useScreenWidth";
import { useEffect, useState } from "react";
import NoProject from "../../components/NoProject";

function DashboardDesktop () {
    const w = useScreenWidth();
    const [ancho, setAncho] = useState("");
    const [projects, setProjects] = useState(0);


    useEffect(() => {
        const tamaño = w/4
        if (tamaño < 320) {
            setAncho("grid grid-cols-2")
            console.log('Este es el tamaño: ', tamaño)
        } else {
            setAncho("grid grid-cols-3")
    }
    console.log(w/4)
    }, [w])



    return (
        <>
            <div className="flex flex-col justify-start items-center w-full min-h-screen bg-background py-[170px] px-15">
                {/* Main Content */}
                <main className="flex flex-col w-full container mx-auto space-y-16">

                    <section className="grid grid-cols-4 gap-3 w-full">
                        <CardWelcome/>
                        <CardDashboard titulo={"Total de proyectos"} value={"1"}/>
                        <CardDashboard titulo={"Template más usado"} value={"1"}/>
                        <CardDashboard titulo={"Último proyecto"} value={"1"}/>
                    </section>

                    <section className="flex items-start justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Mis Proyectos</h1>
                                <p className="text-muted-foreground">Gestiona todos tus proyectos creados desde templates</p>
                            </div>
                            {/* <Link href="/dashboard/new-project"> */}
                                <button className="flex justify-center items-center gap-4 btn-outline">
                                    <BiPlus className="h-4 w-4" />
                                    Nuevo Proyecto
                                </button>
                            {/* </Link> */}
                        </section>
                    
                    {projects === 0 ? (
                        <NoProject/>
                    ) : ( 
                        <>
                        <section className={`${ancho} justify-center gap-10`}>
                            <CardProject border={"hover:border-[#61dbfb]"} shadow={"hover:shadow-[0_0_5px_0px_#61dbfb]"} name="Este es un proyecto"/>
                            <CardProject border={"hover:border-gray-400"} shadow={"hover:shadow-[0_0_5px_0px_#99a1af]"} name="Proyecto"/>
                            <CardProject border={"hover:border-[#306998]"} shadow={"hover:shadow-[0_0_5px_0px_#306998aa]"} name="Este es un proyecto"/>
                            <CardProject border={"hover:border-[#61dbfb]"} shadow={"hover:shadow-[0_0_5px_0px_#61dbfb]"} name="Este es un proyecto"/>
                        </section>
                        </>
                    )}
                </main>
            </div>
        </>
    )
}
export default DashboardDesktop