import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AuthHook from '../Context/AuthContext'
import { FaSadCry, FaVideo } from "react-icons/fa";
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
import { RiMapPinUserFill } from "react-icons/ri";
import cookies from 'js-cookie'
import { IoIosLogOut } from "react-icons/io";

function Navbar() {
    const { userDetails, getUserDetails, islogedIn, setislogedIn, setuserDetails, settoken, } = AuthHook()
    const { toggletheme, darkstate, setsidebarSize, sidebarSize, path, setpath, setdata, setloading, search, setsearch } = useMain();
    const [searchShow, setsearchShow] = useState(false);
    const [userModel, setuserModel] = useState(false)
    const [searchSuggest, setsearchSuggest] = useState()

    const navigate = useNavigate()
    const handlelogout = () => {
        cookies.remove("token");
        settoken(null);
        setislogedIn(false);
        setuserDetails(null);
        window.location.reload();
        navigate("/")
    }

    const handleSuggest = async (e) => {
        setsearch(e.target.value);
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/video/suggestSearch`, {
            search: search
        })
        setsearchSuggest(res.data.response);
    }

    const handlesearch = async (e) => {
        e.preventDefault();
        setsearchSuggest([]);
        setloading(true)
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/video/search`, {
            search: search
        })
        console.log(res.data.response.data);
        setdata(res.data.response.data);
        setloading(false)
    }


    useEffect(() => {
        if (islogedIn) {
            getUserDetails()
        }
    }, [])

    return (
        // <div className=' dark:bg-dark_black bg-white flex justify-between items-center border-b dark:border-[#353333] p-2 h-[8svh] sm:h-[8vh] max-h-[8vh]'>
        <div className=' flex justify-between items-center border-b dark:border-[#353333] p-2 h-[8svh] sm:h-[8vh] max-h-[8vh]'>
            <section className={`${searchShow ? "flex" : "hidden"} flex justify-center items-center w-[100%] `}>
                <section className=' w-[12%]'>
                    <IoArrowBackCircleOutline size={30} className='dark:text-white cursor-pointer text-black' onClick={() => { setsearchShow(false) }} />
                </section>
                <section className='w-[88%] '>
                    <form className=' w-[100%] flex justify-center items-center'>
                        <input className=' dark:bg-light_black bg-bg_white  text-black rounded-full text-sm px-5 py-[5px] w-[100%] dark:text-text dark:border-none border focus:outline-none' placeholder='search' />
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
            <section className={`hidden w-[60%] sm:block relative`}>
                <form onSubmit={handlesearch} className='w-[100%] flex justify-center items-center'>
                    <input onChange={handleSuggest} value={search} className='dark:bg-light_black bg-bg_white text-black rounded-full text-sm px-5 py-[5px] w-[90%] dark:text-text dark:border-none border focus:outline-none' placeholder='search' />
                </form>
                <section className={`z-30 w-[100%] flex justify-center items-center max-h-48 overflow-y-auto absolute mt-1 ${search === "" || searchSuggest?.length === 0 ? "hidden" : ""}`}>
                    <div className='dark:bg-light_black w-[90%] max-h-48 p-2 text-sm rounded-lg overflow-y-auto'>
                        {
                            searchSuggest?.map((item, index) => (
                                <h1 key={index} className=' line-clamp-1'>{item.title}</h1>
                            ))
                        }
                    </div>
                </section>
            </section>

            <section className={`${searchShow ? "hidden" : "flex"} w-[20%] justify-end gap-2 items-center `}>
                <section className=' sm:hidden'>
                    <BsSearch size={23} className='dark:text-white cursor-pointer text-black' onClick={() => setsearchShow(true)} />
                </section>
                <section>
                    {
                        darkstate ? <MdOutlineLightMode size={25} className='dark:text-white cursor-pointer text-black' onClick={toggletheme} /> :
                            <MdOutlineDarkMode size={25} className='dark:text-white cursor-pointer text-black' onClick={toggletheme} />
                    }

                </section>
                <button onClick={() => {
                    navigate("/auth/login")
                }} className={`${islogedIn ? "hidden" : ""} bg-gradient-to-tr via-[#FF0000] from-[#FF0000] to-[#c10505]  text-white px-5 text-sm  py-[4px] rounded-3xl font-semibold dark:hover:bg-light_black hover:bg-black`}>Login</button>
                <section className=' relative mr-4'>
                    <button onClick={() => setuserModel(true)} className={`${userDetails ? "" : "hidden"} dark:text-text text-xs text-black`} >{userDetails?.username}</button>
                    <div className={` ${userModel ? "block" : "hidden"} absolute dark:bg-medium_black bg-bg_white dark:text-white text-black w-28 z-30 mt-2 right-0 rounded-lg p-2 px-3`}>
                        <section className=' flex justify-end '>
                            <RxCross1 className='float-right cursor-pointer' size={18} onClick={() => setuserModel(false)} />
                        </section>
                        <p onClick={() => {
                            setuserModel(false)
                            navigate("/profile")
                        }} className=' flex items-center gap-1 cursor-pointer text-sm my-1'><RiMapPinUserFill size={18} />Profile</p>
                        <p className=' flex items-center gap-1 cursor-pointer text-sm my-1' onClick={() => document.getElementById('logoutModel').showModal()}><IoIosLogOut size={18} />Logout</p>
                    </div>
                </section>
            </section>

            <dialog id="logoutModel" className="modal">
                <div className="modal-box bg-white dark:bg-black">
                    <h3 className="text-lg dark:text-white text-black">Are you want to logout ?</h3>
                    <div className=' flex justify-end gap-2'>
                        <button onClick={handlelogout} className='hover:bg-red-800 dark:hover:bg-red-800 dark:hover:text-white text-sm hover:text-white px-4 py-[6px] rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white'>logout</button>
                        <button onClick={() => document.getElementById('logoutModel').close()} className='dark:hover:bg-red-800 text-sm dark:hover:text-white hover:bg-red-800 hover:text-white px-4 py-[6px] rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white'>Cancel</button>
                    </div>
                </div>
            </dialog>

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
                    <section onClick={() => {
                        setpath("subscribed")
                        navigate("/subscribed")
                        setsidebarSize(false)
                    }} className={` ${path == "subscribed" ? "bg-white dark:bg-light_black" : ""} hover:bg-bg_white dark:text-white dark:hover:bg-light_black text-black px-4 py-2 rounded-xl cursor-pointer flex items-center gap-4`}>
                        <FiUsers size={27} />
                        <h1 className={`text-md`}>Subscription</h1>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Navbar