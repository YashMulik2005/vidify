import React, { useEffect, useState } from 'react'
import logo from "../../assets/channellogo.png"
import axios from 'axios'
import AuthHook from '../Context/AuthContext'
import VideoCard from '../videos/VideoCard';
import { useNavigate } from 'react-router-dom';
import ProfileSkeleton from '../loaders/ProfileSkeleton';

function Profile() {
    const { token } = AuthHook();
    const Navigate = useNavigate();
    const [userData, setuserData] = useState()
    const [watchHisstory, setwatchHisstory] = useState()
    const [loading, setloading] = useState(false)

    const getUserData = async () => {
        setloading(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, {
            headers: {
                "authentication": `bearer ${token}`
            }
        });
        setuserData(res.data.data);
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

    useEffect(() => {
        getUserData();
        getHistory();
    }, [])


    return (
        <div className=' px-2 sm:px-5 py-1 overflow-y-auto'>
            {
                loading ? <ProfileSkeleton /> :
                    <section>
                        <section className=' flex justify-between sm:pr-10 py-1'>
                            <div className=' flex justify-bu items-center w-[60%]'>
                                <img src={logo} className=' w-28 h-28' />
                                <section>
                                    <h1 className=' font-semibold text-xl dark:text-white text-black'>{userData?.username}</h1>
                                    <h1 className='text-gray-600'>{userData?.fname + " " + userData?.lname}</h1>
                                    <p className='text-gray-600'>{userData?.email}</p>
                                    <button onClick={() => {
                                        document.getElementById('logoutModel').showModal()
                                    }} className={`bg-gradient-to-tr my-2 via-[#FF0000] from-[#FF0000] to-[#c10505] text-white px-5 text-xs  py-[4px] rounded-3xl font-semibold dark:hover:bg-light_black hover:bg-black`}>Logout</button>
                                </section>
                            </div>
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
                            </div>
                        </section>
                        <div className=' border border-gray-500 '></div>
                        <section className=' py-3'>
                            <setcion className="flex justify-between px-3 py-1 dark:text-white text-black">
                                <h1>Watch History</h1>
                                <h1 className=' cursor-pointer' onClick={() => Navigate("/watchHistroy")}>See All views</h1>
                            </setcion>
                            <div className=' grid grid-cols-1 sm:grid-cols-4 overflow-x-auto'>
                                {
                                    watchHisstory?.map((item, index) => {
                                        return <VideoCard type="add" data={item.video} key={index} />
                                    })
                                }
                                {/* <div>SEE MORE</div> */}
                            </div>
                        </section>
                        <div className=' border border-gray-500 '></div>
                        <section>
                            <setcion className="flex justify-between px-3 py-2 sm:py-1 dark:text-white text-black">
                                <h1>Interested Area</h1>
                                <h1 className=' cursor-pointer text-sm'>Edit Interested Area</h1>
                            </setcion>
                            <div className=' flex flex-wrap gap-2 text-sm justify-center items-center p-2'>
                                {userData?.interested_area?.map((item, index) => {
                                    return <section key={index} className={`bg-red-50 text-gray-500 dark:text-gray-700 px-3 py-[5px] border dark:border-none rounded-full cursor-pointer `}>{item.name}</section>
                                })}
                            </div>
                        </section>
                    </section>
            }
        </div>
    )
}

export default Profile