import { BiPlus } from "react-icons/bi";
import CardWelcome from "../../components/CardWelcome";
import CardDashboard from "../../components/CardDashboard";
import { useEffect, useState } from "react";
import getProjects from "../../services/getProjects";
import type { Project } from "../../types/project";
import ViewProjects from "../../components/ViewProjects";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function DashboardDesktop () {
    const { isAuthenticated, loading } = useAuth()
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [listProject, setListProject] = useState<Project[]>([]);
    
    useEffect(() => {
        const getListProjects = async () => {
            setLoadingProjects(true);
            try {
                const projects: Project[] = await getProjects()
                if (!projects) {
                    throw new Error('No se encontraron proyectos.')
                }
                setListProject(projects)
            } catch (error) {
                console.error(error);
                setListProject([])
            } finally {
                setLoadingProjects(false)
            }
        }

        if (isAuthenticated && !loading) {
            getListProjects()
        }
    }, [])

    return (
        <>
            <div className="flex flex-col justify-start items-center w-full min-h-screen bg-background pt-[160px] px-15">
                {/* Main Content */}
                <main className="flex flex-col w-full container mx-auto space-y-16">

                    <section className="grid grid-cols-4 gap-3 w-full">
                        <CardWelcome/>
                        <CardDashboard titulo={"Total de proyectos"} value={listProject.length}/>
                        <CardDashboard titulo={"Template más usado"} value={"1"}/>
                        <CardDashboard titulo={"Último proyecto"} value={"1"}/>
                    </section>

                    <section className="flex items-start justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Mis Proyectos</h1>
                                <p className="text-muted-foreground">Gestiona todos tus proyectos creados desde templates</p>
                            </div>
                            <Link to="/dashboard/new-project">
                                <button className="flex justify-center items-center gap-4 btn-outline">
                                    <BiPlus className="h-4 w-4" />
                                    Nuevo Proyecto
                                </button>
                            </Link>
                    </section>
                    
                    <ViewProjects loading={loadingProjects} listProject={listProject} />
                </main>
            </div>
        </>
    )
}
export default DashboardDesktop