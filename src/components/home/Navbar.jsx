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
import { IoMdSearch } from "react-icons/io";
import logo from "../../assets/user_default.png"
import { MdSlowMotionVideo } from "react-icons/md";
import { RiMovie2Line } from "react-icons/ri";

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
        navigate("/")
        window.location.reload();
    }

    const handleSuggest = async () => {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/video/suggestSearch`, {
            search: search == "" ? null : search
        })
        setsearchSuggest(res.data.response);
    }

    const handlesearch = async (q = null) => {
        setsearch(null)
        setsearchSuggest([]);
        setloading(true)
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/video/search`, {
            search: q != null ? q : search == null ? "" : search
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

    useEffect(() => {
        handleSuggest();
    }, [search])

    useEffect(() => {
        if (search === "") {
            handlesearch()
        }
    }, [search == ""])

    return (
        // <div className=' dark:bg-dark_black bg-white flex justify-between items-center border-b dark:border-[#353333] p-2 h-[8svh] sm:h-[8vh] max-h-[8vh]'>
        <div className=' flex justify-between items-center border-b dark:border-[#353333] p-2 h-[10svh] sm:h-[10vh] max-h-[10vh]'>
            <section className={`${searchShow ? "flex" : "hidden"} flex justify-center items-center w-[100%] `}>
                <section className=' w-[12%]'>
                    <IoArrowBackCircleOutline size={25} className='dark:text-white cursor-pointer text-black' onClick={() => { setsearchShow(false) }} />
                </section>
                <section className='w-[88%] relative'>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handlesearch()
                    }} className=' w-[100%] flex justify-center items-center'>
                        <input onChange={(e) => setsearch(e.target.value)} className=' dark:bg-light_black bg-bg_white  text-black rounded-full text-sm px-5 py-[5px] w-[100%] dark:text-text dark:border-none border focus:outline-none' placeholder='search' />
                    </form>
                    <section className={`z-30 w-[100%] flex justify-center items-center max-h-80 overflow-y-auto absolute mt-1 ${search === "" || searchSuggest?.length === 0 ? "hidden" : ""}`}>
                        <div className='dark:bg-light_black bg-white w-[100%] max-h-80
                      text-sm rounded-lg overflow-y-auto'>
                            {
                                searchSuggest?.map((item, index) => (
                                    <div key={index} className='hover:bg-gray-100 dark:hover:bg-black py-[4px] px-2 line-clamp-1 my-[8px] text-black dark:text-white flex items-center gap-3'>
                                        <section className='w-[6%]'>
                                            <IoMdSearch size={20} />
                                        </section>
                                        <section className='w-[94%] cursor-pointer hover:bg-gray-100' onClick={() => {
                                            handlesearch(item.title);
                                        }}>
                                            {item.title}
                                        </section>
                                    </div>
                                ))
                            }
                        </div>
                    </section>
                </section>
            </section>
            <section className={`${searchShow ? "hidden" : "flex"} justify-start items-center gap-3 w-[30%] sm:w-[20%]`}>
                <section className=' sm:hidden'>
                    <RxHamburgerMenu className=' dark:text-white cursor-pointer text-black' size={30} onClick={() => setsidebarSize(!sidebarSize)} />
                </section>
                <section className=' flex justify-center items-center'>
                    <h1 className='dark:text-white  font-bold text-black'>Stream</h1>
                    <MdSlowMotionVideo size={27} color='#DC2626' />
                    <h1 className='dark:text-white  font-bold text-black'>Spot</h1>
                    {/* <h1 className='dark:text-white text-lg  font-bold text-black'>Video</h1>
                    <MdSlowMotionVideo size={27} color='#DC2626' />
                    <h1 className='dark:text-white text-lg font-bold text-black'>Nest</h1> */}
                </section>
            </section>
            {
                window.location.pathname === "/home" || window.location.pathname === "/" &&
                <section className={`hidden w-[60%] sm:block relative`}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handlesearch()
                    }} className='w-[100%] flex justify-center items-center'>
                        <input onChange={(e) => setsearch(e.target.value)} value={search} className='dark:bg-light_black bg-bg_white text-black rounded-full text-sm px-5 py-[5px] w-[90%] dark:text-text dark:border-none border focus:outline-none' placeholder='search' />
                    </form>
                    <section className={`z-30 w-[100%] flex justify-center items-center max-h-80 overflow-y-auto absolute mt-1 ${search === null || searchSuggest?.length === 0 ? "hidden" : ""}`}>
                        <div className='dark:bg-light_black bg-white w-[90%] max-h-80
                      text-sm rounded-lg overflow-y-auto'>
                            {
                                searchSuggest?.map((item, index) => (
                                    <div key={index} className=' hover:bg-gray-100 dark:hover:bg-black py-[4px] px-2 line-clamp-1 my-[8px] text-black dark:text-white flex items-center gap-3'>
                                        <section className='w-[4%]'>
                                            <IoMdSearch size={20} />
                                        </section>
                                        <section className='w-[96%] cursor-pointer ' onClick={() => {
                                            handlesearch(item.title);
                                        }}>
                                            {item.title}
                                        </section>
                                    </div>
                                ))
                            }
                        </div>
                    </section>
                </section>
            }

            <section className={`${searchShow ? "hidden" : "flex"} w-[30%] sm:w-[20%] justify-end gap-2 items-center`}>
                {
                    window.location.pathname === "/home" || window.location.pathname === "/" ?
                        <section className=' sm:hidden'>
                            <BsSearch size={24} className='dark:text-white cursor-pointer text-black' onClick={() => setsearchShow(true)} />
                        </section> : ""
                }
                <section className=''>
                    {
                        darkstate ? <MdOutlineLightMode size={24} className='dark:text-white cursor-pointer text-black' onClick={toggletheme} /> :
                            <MdOutlineDarkMode size={24} className='dark:text-white cursor-pointer text-black' onClick={toggletheme} />
                    }

                </section>
                <button onClick={() => {
                    navigate("/auth/login")
                }} className={`${islogedIn ? "hidden" : ""} bg-gradient-to-tr via-[#FF0000] from-[#FF0000] to-[#c10505]  text-white px-5 text-sm  py-[4px] rounded-3xl font-semibold dark:hover:bg-light_black hover:bg-black`}>Login</button>
                <section className=' relative sm:mr-4'>
                    <img onClick={() => setuserModel(true)} className={`${userDetails ? "" : "hidden"} h-10 w-10 rounded-3xl cursor-pointer `} src={userDetails?.profile_image ? userDetails.profile_image : logo} />
                    <div className={` ${userModel ? "block" : "hidden"} absolute dark:bg-medium_black bg-bg_white dark:text-white text-black w-28 z-30 mt-2 right-0 rounded-lg p-2 px-3`}>
                        <section className=' flex justify-end '>
                            <RxCross1 className='float-right cursor-pointer' size={24} onClick={() => setuserModel(false)} />
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