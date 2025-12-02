import { RiNumber1, RiNumber2, RiNumber3 } from "react-icons/ri"
import LandingPageCard from "../../components/landingPageCard"
import { TiSocialGithub } from "react-icons/ti"
import { BsLayoutWtf, BsLightningCharge } from "react-icons/bs"
import { LuSettings } from "react-icons/lu"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/navbar"

function LandingPageDesktop () {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <main className="w-full h-screen">
            <section className={`relative flex flex-col justify-center items-center w-full h-screen gap-28`}>
                <div className="w-full absolute top-0 left-0">
                    <Navbar />
                </div>
                <img src="#" alt="logo" />
                <div className="flex flex-col w-full justify-center items-center text-5xl px-5 font-bold text-center">
                    <div className="flex items-center gap-2 px-5 py-3 mb-10 font-medium text-[15px] text-[#008781] rounded-full bg-[#2dd4cf20] hover:border hover:border-[#008781]">
                        <BsLightningCharge/>
                        Management your templates
                    </div>
                    <h1 className="md:mb-2 lg:mb-5">Deploy your repository with <span className="px-5 bg-linear-to-tr from-[#2dd4cf] to-[#008781] rounded-full hover:shadow-[0_0_70px_0px_#00ffaa] transition-all duration-700 text-gray-200">Hosti</span></h1>
                    <h1>and turn it into a functional web service</h1>
                    <p className="hidden md:flex text-[15px] md:text-xl lg:text-2xl font-normal lg:mt-4">
                        With Hosti, you can create and manage your web projects without complications:<br/> select a template, connect your GitHub repository, and let our platform take care of the rest.
                    </p>

                    <p className="flex md:hidden text-[15px] font-normal">
                        With Hosti, you can create and manage your web projects without complications.
                    </p>
                    <div className="flex items-center h-[70px] font-medium text-sm gap-2 mt-5 lg:text-lg lg:gap-5 lg:mt-10">
<<<<<<< HEAD
                        <button 
                            onClick={handleGetStarted}
                            className="cursor-pointer h-[50px] w-[150px] hover:shadow-[0_0_30px_0px_#00ffaa] transform hover:scale-105 transition-all duration-500 btn-primary"
                        >
=======
                        <button className="cursor-pointer h-[50px] w-[150px] hover:shadow-[0_0_30px_0px_#3de6c9] transform hover:scale-105 transition-all duration-500 btn-primary">
>>>>>>> c3ed765d35e3bfbbb3944b3fdcfb05e6ac11bbce
                            Get start
                        </button>
                        <button className="cursor-pointer w-[100px] h-[50px] lg:w-[150px] btn-secondary">
                            Contact us
                        </button>
                    </div>
                </div>
            </section>

            <section className={`flex flex-col justify-center items-center w-full py-28 gap-16 bg-[#f8f8f8]`}>
                <div className="container flex flex-col justify-center items-center gap-8">
                    <div className="flex justify-center items-center rounded-2xl w-[50px] h-[50px] bg-linear-to-tr from-[#3de6c9] to-[#2dd4cf]">
                        <LuSettings size={25} color="white"opacity={0.5}/>
                    </div>
                <h2 className="text-4xl font-bold">¿How work?</h2>
                </div>
                
                <div className="container flex w-[70%] gap-5">
                    <LandingPageCard icon={<RiNumber1 />} title="Selecciona un template" description="Elige entre nuestros templates base optimizados para diferentes tipos de proyectos."/>
                    <LandingPageCard icon={<RiNumber2 />} title="Selecciona un template" description="Elige entre nuestros templates base optimizados para diferentes tipos de proyectos."/>
                    <LandingPageCard icon={<RiNumber3 />} title="Selecciona un template" description="Elige entre nuestros templates base optimizados para diferentes tipos de proyectos."/>
                </div>
            </section>

            <section className={`flex flex-col justify-center items-center w-full py-28 gap-16`}>
                <div className="flex flex-col justify-center items-center gap-8">
                    <div className="flex justify-center items-center rounded-2xl w-[50px] h-[50px] bg-linear-to-tr from-[#3de6c9] to-[#2dd4cf]">
                        <BsLayoutWtf size={25} color="white" opacity={0.5}/>
                    </div>
                <h2 className="text-4xl font-bold">Available templates</h2>
                </div>
                <div className="container flex w-[70%] gap-5">
                    <LandingPageCard icon={<TiSocialGithub size={40} />} title="Selecciona un template" description="Elige entre nuestros templates base optimizados para diferentes tipos de proyectos."/>
                    <LandingPageCard icon={<TiSocialGithub size={40} />} title="Selecciona un template" description="Elige entre nuestros templates base optimizados para diferentes tipos de proyectos."/>
                    <LandingPageCard icon={<TiSocialGithub size={40} />} title="Selecciona un template" description="Elige entre nuestros templates base optimizados para diferentes tipos de proyectos."/>
                </div>
            </section>

            <section className={`flex flex-col justify-center items-center w-full py-28 px-10 gap-16`}>
                <div className="flex flex-col justify-center items-center gap-8">
                    <div className="flex justify-center items-center rounded-2xl w-[50px] h-[50px] bg-linear-to-tr from-[#3de6c9] to-[#2dd4cf]">
                        <LuSettings size={25} color="white"opacity={0.5}/>
                    </div>
                    <h2 className="text-4xl font-bold">All you need</h2>
                    <div className="grid grid-cols-2 gap-2 mt-5">
                        <div className="flex flex-col p-5 rounded-xl border border-[#2dd4cf]">
                            <div className="flex justify-center items-center w-[50px] h-[50px] rounded-xl bg-[#2dd4cf]">
                                <img src="#" alt="icono" />
                            </div>
                            <h3 className="font-bold mt-5">Autenticación segura</h3>
                            <p>Cada usuario tiene su espacio personal protegido para gestionar sus proyectos.</p>
                        </div>
                        <div className="flex flex-col justify-evenly p-5 rounded-xl bg-linear-to-tr from-[#3de6c9] to-[#2dd4cf]">
                            <div className="flex justify-center items-center w-[50px] h-[50px] rounded-xl bg-white opacity-[0.5]">
                                <img src="#" alt="icono" />
                            </div>
                            <h3 className="font-bold mt-5 text-white">Integración con GitHub</h3>
                            <p className="text-white">Clona templates directamente a tu repositorio personal de GitHub sin complicaciones.</p>

                        </div>
                        <div className="flex flex-col justify-evenly p-5 rounded-xl bg-linear-to-tr from-[#3de6c9] to-[#2dd4cf]">
                            <div className="flex justify-center items-center w-[50px] h-[50px] rounded-xl bg-white opacity-[0.5]">
                                <img src="#" alt="icono" />
                            </div>
                            <h3 className="font-bold mt-5 text-white">Gestión Centralizada</h3>
                            <p className="text-white">Administra todos tus proyectos desde un dashboard intuitivo y fácil de usar.</p>
                        </div>
                        <div className="flex flex-col justify-evenly p-5 rounded-xl border border-[#2dd4cf]">
                            <div className="flex justify-center items-center w-[50px] h-[50px] rounded-xl bg-[#2dd4cf]">
                                <img src="#" alt="icono" />
                            </div>
                            <h3 className="font-bold mt-5">Templates Funcionales</h3>
                            <p>Todos los templates son completamente funcionales e independientes desde el primer día.</p>

                        </div>
                    </div>
                </div>

            </section>

            <footer className="flex flex-col justify-center items-center w-full border-t border-gray-100 h-[200px] gap-5">
                <img src="#" alt="Logo" />
                <div className="text-center w-full">
                    <p> Platform hosting. </p>
                    <p> Manage your project with templates from Github </p>
                    <p>© 2025 ProjectHosti</p>
                </div>
            </footer>
        </main>
    )
}

export default LandingPageDesktop