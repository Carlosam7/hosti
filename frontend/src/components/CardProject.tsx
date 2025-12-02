import { GrReactjs } from "react-icons/gr"
import { BiExport, BiLink, BiTrash } from "react-icons/bi";

import type { Project } from "../types/project";
import deleteProject from "../services/deleteProject";

function CardProject ({ project }: { project: Project }) {
    return (
        <>
            <div className={`felx justify-center items-center w-full rounded-2xl bg-white border border-gray-100 shadow-[0_0px_5px_0_#dddddd] hover:border-gray-400 hover:shadow-[0_0_5px_0px_#99a1af] hover:scale-102 px-8 py-10 transition-all duration-500`}>
                <main className="flex flex-col gap-10 justify-between h-auto">
                    <section className="flex justify-between w-full">
                        <div>
                            <h2 className="text-2xl font-medium">{project.subdomain.split('.')[0].toUpperCase()}</h2>
                            <p className="text-[12px]">Templeate: templeate 1</p>
                        </div>
                        <div className="flex h-min rounded-full bg-[#3ab8b0] px-4 py-1 text-white">
                            <p> Active </p>
                        </div>
                    </section>

                    <section>
                        <p className="text-[#707070] font-light line-clamp-2">
                            {project.description}
                        </p>
                    </section>

                    <section className="flex space-x-2">
                        <button className="cursor-pointer flex items-center p-1 rounded-full border 1-[#6ddbd7] px-4 text-[#2dd4cf] space-x-2 hover:bg-[#2dd4cf] hover:text-white transition-all duration-500">
                            <GrReactjs/>
                            <p>Hosti</p>
                        </button>
                        <span className="flex items-center p-1 rounded-full border 1-[#6ddbd7] px-4 text-gray-400">
                            {`${project.createdAt}`}
                        </span>
                    </section>

                    <section className="flex justify-start items-center space-x-2 line-clamp-1 border-b border-gray-200">
                        <BiLink/>
                        <a href={`http://${project.subdomain}.localhost`} target="_blank" className="hover:text-[#3ab8b0]">{`http://${project.subdomain}.localhost`}</a>
                    </section>

                    <section className="flex space-x-2">
                        <a href={project.repoUrl} className="cursor-pointer flex justify-center items-center w-full h-auto border border-gray-300 rounded-xl space-x-5 font-medium hover:bg-gray-100 duration-500">
                            <BiExport/>
                            <span>Ver en Github</span>
                        </a>
                        <button className="cursor-pointer bg-[#ff9090] hover:bg-[#ff5050] rounded-xl p-3 transition-all duration-500"
                            onClick={() => deleteProject(project.subdomain.split('.')[0])}
                        >
                            <BiTrash color="white"/>
                        </button>
                    </section>
                </main>
            </div>
        </>
    )
}

export default CardProject