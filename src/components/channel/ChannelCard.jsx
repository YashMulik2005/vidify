import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdSubscriptions } from "react-icons/md";
import AuthHook from '../Context/AuthContext';
import axios from 'axios';


function ChannelCard({ data }) {
    const navigate = useNavigate();
    const { userDetails, getUserDetails, token, islogedIn } = AuthHook()
    const [subsciberCount, setsubsciberCount] = useState(data?.subscribers?.length);

    const subscribe = async () => {
        if (islogedIn) {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/channel/subscribe`, {
                channelId: data?._id
            }, {
                headers: {
                    "authentication": `bearer ${token}`
                }
            })
            if (res.data.status) {
                getUserDetails();
                setsubsciberCount(prevCount => prevCount + 1)
            } else {
                toast.error("someting went wrong...")
            }
        } else {
            document.getElementById('loginModel').showModal()
        }
    }

    const unsubscribe = async () => {
        if (islogedIn) {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/channel/unsubscribe`, {
                channelId: data?._id
            }, {
                headers: {
                    "authentication": `bearer ${token}`
                }
            })
            if (res.data.status) {
                getUserDetails();
                setsubsciberCount(prevCount => prevCount - 1)
            } else {
                toast.error("someting went wrong...")
            }
        } else {
            document.getElementById('loginModel').showModal()
        }
    }

    return (
        <div onClick={() => {
            navigate(`/channel/${data?._id}`)
        }} className=' dark:text-white cursor-pointer bg-bg_white border dark:border-none dark:bg-medium_black rounded-lg p-3'>
            <section className=' flex items-center justify-between'>
                <img className=' w-16 h-16  rounded-full object-cover'
                    src={data?.profile_image} />
                {
                    userDetails && userDetails.subscribed && userDetails.subscribed.includes(data?._id) ? (
                        <button onClick={(e) => {
                            e.stopPropagation();
                            unsubscribe()
                        }} className=' bg-gray-500 text-sm text-white px-3 py-[4px] rounded-full flex items-center gap-2'><MdSubscriptions size={15} />Unsubcribe</button>
                    ) : (
                        <button onClick={(e) => {
                            e.stopPropagation();
                            subscribe()
                        }} className=' bg-gradient-to-r via-[#FF0000] from-[#FF0000] to-[#c10505] text-sm text-white px-3 py-[4px] rounded-full flex items-center gap-2'><MdOutlineSubscriptions size={15} />Subcribe</button>
                    )
                }
            </section>
            <h1 className='mt-2 font-semibold text-black  dark:text-white'>{data?.name}</h1>
            <h1 className='line-clamp-3 text-sm text-gray-500'>{data?.description}</h1>
            <h1 className=' text-black text-sm mt-1  dark:text-white'> {subsciberCount} {subsciberCount > 1 || subsciberCount == 0 ? "subscribers" : "subscriber"}</h1>


            <dialog id="loginModel" className="modal">
                <div className="modal-box bg-white dark:bg-black">
                    <h3 className="text-lg dark:text-white text-black">Login to subscribe</h3>
                    <div className=' flex justify-end gap-2'>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            navigate("/Auth/login")
                        }} className='hover:bg-red-800 dark:hover:bg-red-800 dark:hover:text-white text-sm hover:text-white px-4 py-[6px] rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white'>login</button>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('loginModel').close()
                        }
                        } className='dark:hover:bg-red-800 text-sm dark:hover:text-white hover:bg-red-800 hover:text-white px-4 py-[6px] rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white'>Cancel</button>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default ChannelCard