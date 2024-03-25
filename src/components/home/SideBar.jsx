import React from 'react'
import useMain from '../Context/MainContext'
import { IoHomeOutline } from "react-icons/io5";
import { PiTelevisionSimpleBold } from "react-icons/pi";
import { FiUsers } from "react-icons/fi";
import { useNavigate } from 'react-router-dom'

function SideBar() {
    const { sidebarSize } = useMain()
    const navigate = useNavigate()
    return (
        <div className=' bg-white dark:bg-dark_black h-[92svh] sm:h-[92vh] flex flex-col px-2 py-4 gap-4'>
            <section onClick={() => {
                navigate("/")
            }} className=' hover:bg-bg_white dark:text-text text-black dark:hover:bg-light_black p-2 rounded-xl cursor-pointer flex flex-col items-center justify-center'>
                <IoHomeOutline size={25} />
                <h1 className={`text-xs`}>Home</h1>
            </section>
            <section onClick={() => {
                navigate("/channel")
            }} className=' hover:bg-bg_white dark:text-text text-black dark:hover:bg-light_black p-2 rounded-xl cursor-pointer flex flex-col items-center justify-center'>
                <PiTelevisionSimpleBold size={25} />
                <h1 className={`text-xs`}>Channel</h1>
            </section>
            <section onClick={() => {
                navigate("/yourchannel")
            }} className=' hover:bg-bg_white dark:text-text text-black dark:hover:bg-light_black p-2 rounded-xl cursor-pointer flex flex-col items-center justify-center'>
                <FiUsers size={25} />
                <h1 className={`text-xs`}>your</h1>
            </section>
        </div>
    )
}

export default SideBar