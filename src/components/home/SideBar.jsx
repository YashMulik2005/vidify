import React from 'react'
import useMain from '../Context/MainContext'
import { IoHomeOutline } from "react-icons/io5";
import { PiTelevisionSimpleBold } from "react-icons/pi";
import { FiUsers } from "react-icons/fi";
import { useNavigate } from 'react-router-dom'

function SideBar() {
    const { sidebarSize, path, setpath } = useMain()
    const navigate = useNavigate()
    return (
        // <div className=' bg-white dark:bg-dark_black h-[92svh] sm:h-[92vh] flex flex-col px-2 py-4 gap-4'>
        <div className=' h-[92svh] sm:h-[92vh] flex flex-col px-2 py-4 gap-2'>
            <section onClick={() => {
                setpath("home")
                navigate("/")
            }} className={` ${path == "home" ? "bg-bg_white dark:bg-light_black" : ""} hover:bg-bg_white dark:text-text text-black dark:hover:bg-light_black p-2 py-3 rounded-xl cursor-pointer flex flex-col items-center justify-center`}>
                <IoHomeOutline size={22} />
                <h1 className={`text-[10px]`}>Home</h1>
            </section>
            <section onClick={() => {
                setpath("channel")
                navigate("/channel")
            }} className={` ${path == "channel" ? "bg-bg_white dark:bg-light_black" : ""} hover:bg-bg_white dark:text-text text-black dark:hover:bg-light_black p-2 py-3 rounded-xl cursor-pointer flex flex-col items-center justify-center`}>
                <PiTelevisionSimpleBold size={22} />
                <h1 className={`text-[10px]`}>Channel</h1>
            </section>
            <section onClick={() => {
                setpath("your")
                navigate("/yourchannel")
            }} className={` ${path == "your" ? "bg-bg_white dark:bg-light_black" : ""} hover:bg-bg_white dark:text-text text-black dark:hover:bg-light_black p-2 py-3 rounded-xl cursor-pointer flex flex-col items-center justify-center`}>
                <FiUsers size={22} />
                <h1 className={`text-[10px]`}>your</h1>
            </section>
            <section onClick={() => {
                setpath("subscribers")
                navigate("/subscribed")
            }} className={` ${path == "subscribers" ? "bg-bg_white dark:bg-light_black" : ""} hover:bg-bg_white dark:text-text text-black dark:hover:bg-light_black p-2 py-3 rounded-xl cursor-pointer flex flex-col items-center justify-center`}>
                <FiUsers size={22} />
                <h1 className={`text-[10px]`}>Subscription</h1>
            </section>

        </div>
    )
}

export default SideBar