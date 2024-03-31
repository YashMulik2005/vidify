import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AuthHook from '../Context/AuthContext'
import { FaVideo } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import useMain from '../Context/MainContext';
import { RxCross1 } from "react-icons/rx";
import { IoHomeOutline } from "react-icons/io5";
import { PiTelevisionSimpleBold } from "react-icons/pi";
import { FiUsers } from "react-icons/fi";
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const { userDetails, setuserDetails, token, setuserDetailsLoader, userDetailsLoader } = AuthHook()
    const { toggletheme, darkstate, setsidebarSize, sidebarSize, path, setpath } = useMain();
    const [searchShow, setsearchShow] = useState(false);

    const navigate = useNavigate()

    const getUserDetails = async () => {

        try {
            const res = await axios.get("http://localhost:3000/api/auth/userDetails", {
                headers: {
                    "authentication": `bearer ${token}`
                }
            });
            setuserDetails(res.data.data.data)
        } catch (err) {
            if (err.response.status == 401) {
                setuserDetails(undefined)
            }
        }
        console.log("settofalse");
        setuserDetailsLoader(false)
    }
    useEffect(() => {
        getUserDetails()
    }, [])

    return (
        <div className=' dark:bg-dark_black bg-white flex justify-between items-center border-b dark:border-[#353333] p-2 h-[8svh] sm:h-[8vh] max-h-[8vh]'>
            <section className={`${searchShow ? "flex" : "hidden"} flex justify-center items-center w-[100%] `}>
                <section className=' w-[12%]'>
                    <IoArrowBackCircleOutline size={30} className='dark:text-white cursor-pointer text-black' onClick={() => { setsearchShow(false) }} />
                </section>
                <section className='  w-[88%]'>
                    <form className=' w-[100%] flex justify-center items-center'>
                        <input className=' dark:bg-medium_black bg-bg_white  text-black rounded-full text-sm px-5 py-[4px] w-[100%] dark:text-text dark:border-none border focus:outline-none' placeholder='search' />
                    </form>
                </section>
            </section>
            <section className={`${searchShow ? "hidden" : "flex"} justify-start items-center gap-3 w-[20%]`}>
                <section className=' sm:hidden'>
                    <RxHamburgerMenu className=' dark:text-white cursor-pointer text-black' size={30} onClick={() => setsidebarSize(!sidebarSize)} />
                </section>
                <section className=' flex justify-center items-center gap-1'>
                    <FaVideo size={30} color='#DC2626' />
                    <h1 className='dark:text-white text-xl font-bold text-black'>Vidify</h1>
                </section>
            </section>
            <section className={` hidden w-[60%] sm:block `}>
                <form className=' w-[100%] flex justify-center items-center'>
                    <input className=' dark:bg-medium_black bg-bg_white text-black rounded-full text-sm px-5 py-[4px] w-[90%] dark:text-text dark:border-none border focus:outline-none' placeholder='search' />
                </form>
            </section>
            <section className={`${searchShow ? "hidden" : "flex"} w-[20%] justify-end gap-3 items-center `}>
                <section className=' sm:hidden'>
                    <BsSearch size={23} className='dark:text-white cursor-pointer text-black' onClick={() => setsearchShow(true)} />
                </section>
                <section>
                    {
                        darkstate ? <MdOutlineLightMode size={27} className='dark:text-white cursor-pointer text-black' onClick={toggletheme} /> :
                            <MdOutlineDarkMode size={27} className='dark:text-white cursor-pointer text-black' onClick={toggletheme} />
                    }

                </section>
                <button onClick={() => {
                    navigate("/auth/login")
                }} className={`${userDetails ? "hidden" : ""} bg-red-600 text-white px-5  py-[5px] rounded-3xl font-semibold dark:hover:bg-light_black hover:bg-black`}>Login</button>
                <button className={`${userDetails ? "" : "hidden"} dark:text-text text-black`}>{userDetails?.username}</button>
            </section>


            <div className={`${sidebarSize ? " w-64 p-4" : "w-0"} border overflow-hidden dark:bg-medium_black bg-bg_white dark:border-none border-r absolute h-[100svh] top-0 z-20 left-0 bottom-0 transition-all duration-300 ease-in-out`}>
                <RxCross1 size={27} className=' dark:text-white cursor-pointer text-black' onClick={() => { setsidebarSize(!sidebarSize) }} />
                <div className=' flex flex-col gap-2 my-4'>
                    <section onClick={() => {
                        setpath("home")
                        navigate("/")
                        setsidebarSize(false)
                    }} className={` ${path == "home" ? "bg-white dark:bg-light_black" : ""} hover:bg-bg_white dark:text-white dark:hover:bg-light_black text-black px-4 py-2 rounded-xl cursor-pointer flex items-center gap-4`}>
                        <IoHomeOutline size={27} />
                        <h1 className={`text-md`}>Home</h1>
                    </section>
                    <section onClick={() => {
                        setpath("channel")
                        navigate("/channel")
                        setsidebarSize(false)
                    }} className={` ${path == "channel" ? "dark:bg-light_black bg-white" : ""} hover:bg-bg_white dark:text-white dark:hover:bg-light_black text-black px-4 py-2 rounded-xl cursor-pointer flex items-center gap-4`}>
                        <PiTelevisionSimpleBold size={27} />
                        <h1 className={`text-md`}>Channel</h1>
                    </section>
                    <section onClick={() => {
                        setpath("your")
                        navigate("/yourchannel")
                        setsidebarSize(false)
                    }} className={` ${path == "your" ? "bg-white dark:bg-light_black" : ""} hover:bg-bg_white dark:text-white dark:hover:bg-light_black text-black px-4 py-2 rounded-xl cursor-pointer flex items-center gap-4`}>
                        <FiUsers size={27} />
                        <h1 className={`text-md`}>your</h1>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Navbar