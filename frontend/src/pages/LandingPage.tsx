import LandingPageDesktop from "../layouts/desktop/LandingPageDesktop"
import useScreenWidth from "../hooks/useScreenWidth"


function LandingPage () {
    const width = useScreenWidth()


    // bg-[url("assets/backgrounds/SL-120722-54440-04.jpg")] bg-cover bg-center
    console.log(window.innerWidth)
    if (width > 650) {
        return (
            <LandingPageDesktop/>
        )

    } else {
        return (
            <div className="flex justify-center items-center bg-amber-400 w-full h-[500px]">Pantalla pequeña</div>
        )
    }
    
    
}

export default LandingPage