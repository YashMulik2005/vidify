import React, { useEffect, useState } from 'react'
import logo from "../../assets/channellogo.png"
import axios from 'axios'
import AuthHook from '../Context/AuthContext'
import VideoCard from '../videos/VideoCard';
import { useNavigate } from 'react-router-dom';
import ProfileSkeleton from '../loaders/ProfileSkeleton';
import noData from '../../assets/noData.png';
import { MdOutlineEdit } from "react-icons/md";
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners'
import { IoIosCamera } from "react-icons/io";

function Profile() {
    const { token } = AuthHook();
    const Navigate = useNavigate();
    const [userData, setuserData] = useState()
    const [watchHisstory, setwatchHisstory] = useState()
    const [loading, setloading] = useState(false)
    const [category, setcategory] = useState();
    const [selectedTopic, setselectedTopic] = useState()
    const [categoryLoader, setcategoryLoader] = useState()

    const getUserData = async () => {
        setloading(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, {
            headers: {
                "authentication": `bearer ${token}`
            }
        });
        setuserData(res.data.data);
        setselectedTopic(res.data.data.interested_area.map(topic => topic._id))
    }

    const select_area = (item) => {
        const index = selectedTopic.indexOf(item._id);
        if (index != -1) {
            const new_arr = [...selectedTopic];
            new_arr.splice(index, 1);
            setselectedTopic(new_arr);
        } else {
            setselectedTopic([...selectedTopic, item._id])
        }
    }

    const getHistory = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/watchHistory`, {
            headers: {
                "authentication": `bearer ${token}`
            }
        });
        setwatchHisstory(res.data.response.data);
        setloading(false)
    }

    const handleTopicEdit = async () => {
        setcategoryLoader(true)
        const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/auth/updateInterstedArea`, {
            category: selectedTopic
        }, {
            headers: {
                authentication: `bearer ${token}`
            }
        })
        if (res.data.status) {
            document.getElementById('topicEditMOdal').close();
            toast.success("Updated Sucessfully..")
            window.location.reload();
        }
        setcategoryLoader(false)
    }

    const getCategory = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/category/getCategory`)
        setcategory(res.data.data.category)
    }

    useEffect(() => {
        getUserData();
        getHistory();
        getCategory();
    }, [])


    return (
        <div className=' px-2 sm:px-5 py-1 overflow-y-auto'>
            {
                loading ? <ProfileSkeleton /> :
                    <section>
                        <section className=' flex justify-between sm:pr-10 py-3'>
                            <div className=' flex gap-3 items-center w-[60%]'>
                                <section className=' relative '>
                                    <img src={logo} className=' w-28 h-28' />
                                    <section className='absolute bottom-2 cursor-pointer right-2 dark:bg-black bg-bg_white rounded-full p-1'><IoIosCamera color='dark:white black' size={20} /></section>
                                </section>
                                <section>
                                    <h1 className=' font-semibold text-xl dark:text-white text-black'>{userData?.username}</h1>
                                    <h1 className='text-gray-600'>{userData?.fname + " " + userData?.lname}</h1>
                                    <p className='text-gray-600'>{userData?.email}</p>
                                    <button onClick={() => {
                                        document.getElementById('logoutModel').showModal()
                                    }} className={`bg-gradient-to-tr my-2 via-[#FF0000] from-[#FF0000] to-[#c10505] text-white px-5 text-xs  py-[4px] rounded-3xl font-semibold dark:hover:bg-light_black hover:bg-black`}>Logout</button>
                                </section>
                            </div>
                            {userData?.channel &&
                                <div className='hidden sm:block my-[8px] p-2 rounded-lg'>
                                    <p className=' dark:text-white text-black text-sm'>Channel Details</p>
                                    <section className=' flex flex-row-reverse items-center gap-3'>
                                        <img src={userData?.channel?.profile_image} className=' w-16 h-16 rounded-full' />
                                        <section>
                                            <h2 className='dark:text-white text-black font-semibold'>{userData?.channel?.name}</h2>
                                            <p className='dark:text-gray-500 text-gray-600'>{userData?.channel?.subscribers?.length} subscribers</p>
                                            <button onClick={() => {
                                                Navigate(`/channel/${userData?.channel?._id}`)
                                            }} className={`bg-gradient-to-tr my-1 via-[#FF0000] from-[#FF0000] to-[#c10505] text-white px-5 text-xs  py-[4px] rounded-3xl font-semibold dark:hover:bg-light_black hover:bg-black`}>View Channel</button>
                                        </section>
                                    </section>
                                </div>}
                        </section>
                        <div className=' border border-gray-500 '></div>
                        <section className=' py-3'>
                            <setcion className="flex justify-between px-3 py-1 dark:text-white text-black">
                                <h1 className=' text-sm sm:text-md'>Watch History</h1>
                                {watchHisstory?.length !== 0 &&
                                    <h1 className=' cursor-pointer' onClick={() => Navigate("/watchHistroy")}>See All views</h1>
                                }
                            </setcion>
                            <div className=' grid grid-cols-1 sm:grid-cols-4 overflow-x-auto'>
                                {
                                    watchHisstory?.length == 0 ? <div className='w-[90vw] flex justify-center items-center flex-col mt-[-15px]'>
                                        <img src={noData} className=' w-36 h-36' alt="No data" />
                                        <h1 className='dark:text-white text-black text-xs'>No video Found</h1>
                                    </div> :
                                        watchHisstory?.map((item, index) => {
                                            return <VideoCard type="add" data={item.video} key={index} />
                                        })
                                }
                                {/* <div>SEE MORE</div> */}
                            </div>
                        </section>
                        <div className=' border border-gray-500 '></div>
                        <section className=' py-2'>
                            <setcion className="flex justify-between px-3 py-2 sm:py-1 dark:text-white text-black">
                                <h1>Interested Area</h1>
                                <h1 onClick={() => {
                                    document.getElementById('topicEditMOdal').showModal();
                                }} className=' cursor-pointer text-sm flex items-center gap-1'>Edit <MdOutlineEdit /></h1>
                            </setcion>
                            <div className=' flex flex-wrap gap-2 text-sm justify-center items-center p-2'>
                                {userData?.interested_area?.map((item, index) => {
                                    return <section key={index} className={`bg-red-50 text-gray-500 dark:text-gray-700 px-3 py-[5px] border dark:border-none rounded-full cursor-pointer `}>{item.name}</section>
                                })}
                            </div>
                        </section>
                    </section>
            }

            <dialog id="topicEditMOdal" className="modal">
                <div className="modal-box bg-white text-black dark:bg-medium_black dark:text-white sm:max-w-[90vh] sm:max-h-[85vh] max-w-[90svh] max-h-[85svh]">
                    <form method="dialog">
                        <button className="btn btn-md btn-circle btn-ghost text-lg absolute right-2 top-2">✕</button>
                    </form>
                    <h1 className=''>Edit Interested Area</h1>
                    {categoryLoader ? <div className=' h-[60vh] flex justify-center items-center flex-col gap-2'> <BeatLoader color=' red' />updating</div> :
                        <div className='overflow-y-auto p-2'>
                            <form className='flex flex-wrap gap-2 justify-center items-center h-[60vh] max-h-[60vh] overflow-y-scroll p-2'>
                                {
                                    category?.map((item) => {
                                        return <section onClick={() => select_area(item)} key={item._id} className={`${selectedTopic?.includes(item._id) ? "bg-red-600 text-white" : " bg-red-100 dark:bg-red-300"} cursor-pointer px-3 text-sm rounded-xl py-[3px]`}>{item.name}</section>
                                    })
                                }
                            </form>
                            <button onClick={handleTopicEdit} type='submit' className='bg-red-500 rounded-lg cursor-pointer text-white px-4 py-[4px] text-sm'>Edit</button>
                        </div>
                    }
                </div>
            </dialog>
        </div>
    )
}

export default Profile