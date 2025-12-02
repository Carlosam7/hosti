import { useAuth } from "../context/AuthContext"

function CardWelcome () {
    const { user } = useAuth()
    return (
        <>
            <div className="">
                <section className="flex flex-col rounded-3xl border border-gray-200 bg-linear-to-tr from-[#f7f7f7] to-[#ffffff] w-full h-[155px]">
                    <h1 className="w-full text-xl text-white font-bold p-5 rounded-t-3xl border-b border-gray-200 bg-linear-to-bl from-[#3de6c9] to-[#2dd4cf]">
                        Welcome back!
                    </h1>
                    <div className="p-5">
                        <h3 className="font-medium">{user?.username}</h3>
                        <h3>{user?.email}</h3>
                    </div>
                </section>
                <section>
                    
                </section>
            </div>
        </>
    )
}

export default CardWelcome