import React from 'react'
import UnauthorizedImg from "../assets/unAuthorized.png"
import { useNavigate } from 'react-router-dom'

function Unauthorized({ msg }) {

    const navigate = useNavigate();
    return (
        <div className=' w-[100%] sm:h-[92vh] h-[92svh] flex justify-center items-center '>
            <section className=' bg-gradient-to-tr from-bg_white via-bg_white dark:from-light_black dark:via-light_black dark:to-[#113853] to-[#a9d0eb] rounded-lg p-5 flex flex-col justify-center gap-2'>
                <img src={UnauthorizedImg} className=' w-60 h-60' />
                <p className=' text-center text-black dark:text-white'>Login to see your {msg}</p>
                <button onClick={() => {
                    navigate("/auth/login")
                }} className={`bg-gradient-to-r via-[#FF0000] from-[#FF0000] to-[#c10505]  text-white px-5 text-sm  py-[4px] rounded-3xl font-semibold dark:hover:bg-light_black hover:bg-black`}>Login</button>
            </section>
        </div>
    )
}

export default Unauthorized