import { useEffect, useState } from "react";
import LoadingPage from "../pages/LoadingPage";
import type { Project } from "../types/project";
import CardProject from "./CardProject";
import NoProject from "./NoProject";
import useScreenWidth from "../hooks/useScreenWidth";

function ViewProjects ({ loading, listProject } : { loading: boolean, listProject: Project[] }) {

    const w = useScreenWidth();
    const [ancho, setAncho] = useState("");

    useEffect(() => {
        const tamaño = w/4
        if (tamaño < 320) {
            setAncho("grid grid-cols-2")
        
        } else {
            setAncho("grid grid-cols-3")
        }
        
    }, [w])


    if (loading) {
        return <LoadingPage/>
    } else if (!listProject || listProject.length === 0) {
        return <NoProject />
    } else {
        return (
        <>
            <section className={`${ancho} justify-center gap-10 mb-16`}>
                {listProject.map((project, index) => (
                    <div
                        key={index}
                    >
                        <CardProject project={project} />
                    </div>
                ))}
            </section>
        </>
    )
    }
}

export default ViewProjects