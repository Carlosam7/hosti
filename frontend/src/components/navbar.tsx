import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar () {
    const { isAuthenticated, logout } = useAuth()
    return (
        <>
            <nav className="fixed z-10 flex justify-center items-center w-full h-[70px] bg-white shadow-md px-20">
                <div className="flex justify-between items-center container h-full">
                    <section>
                        <Link to={'/'}>
                            <button className="cursor-pointer flex justify-center items-center box-border overflow-hidden">
                                <img src="logo/hosti-sin-fondo.png" alt="logo" width={140}/>
                            </button>
                        </Link>
                        
                    </section>

                    <section>
                        {isAuthenticated ? (
                            <Link onClick={logout} to={'/login'} className="cursor-pointer px-5 py-2 btn-primary text-white font-medium ">
                                Log out
                            </Link>
                        ) : (
                            <Link to={'/login'} className="cursor-pointer px-5 py-2 btn-primary text-white font-medium ">
                                Login
                            </Link>
                        )}
                        
                    </section>
                </div>
            </nav>
        </>
    )
}

export default Navbar