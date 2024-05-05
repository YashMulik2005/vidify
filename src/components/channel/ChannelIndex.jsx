import React, { useEffect, useState } from 'react'
import VideoCard from '../videos/VideoCard'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import noData from '../../assets/noData.png'
import AuthHook from '../Context/AuthContext';
import toast from 'react-hot-toast';
import { FiLink } from "react-icons/fi";
import { MdOutlineVideoLibrary, MdSupervisorAccount } from "react-icons/md";
import { PiShareFatLight } from "react-icons/pi";
import ChannelSkeleton from '../loaders/ChannelSkeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import VideoCardSkeleton from '../loaders/VideoCardSkeleton';

function ChannelIndex() {
    const { id } = useParams();
    const [data, setdata] = useState()
    const { userDetails, token, getUserDetails, islogedIn } = AuthHook();
    const [subsciberCount, setsubsciberCount] = useState(0);
    const [loader, setloader] = useState(false)
    const [currentPage, setcurrentPage] = useState(0);
    const [moreData, setmoreData] = useState(false)
    const [videoData, setvideoData] = useState()
    const path = window.location.href;
    const navigate = useNavigate();

    const fatchdata = async () => {
        setloader(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/channel/oneChannel/${id}`)
        //console.log(res.data.data);
        setdata(res.data.data);
        setloader(false)
    }

    const fetchChannelVideos = async () => {
        // setloader(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/video/channel/${id}?limit=4`)
        setcurrentPage(res.data.response.currentPage);
        setmoreData(res.data.response.moreData)
        setvideoData(res.data.response.data)
        // setloader(false)
    }

    const fetchMore = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/video/channel/${id}?limit=4&page=${currentPage + 1}`)
        setcurrentPage(res.data.response.currentPage);
        setmoreData(res.data.response.moreData)
        setvideoData(prev => [...prev, ...res.data.response.data])
    }

    const subscribe = async () => {
        if (islogedIn) {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/channel/subscribe`, {
                channelId: id
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
        }
        else {
            document.getElementById('loginchannelModel').showModal()
        }
    }

    const unsubscribe = async () => {
        if (islogedIn) {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/channel/unsubscribe`, {
                channelId: id
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
            document.getElementById('loginchannelModel').showModal()
        }
    }

    const showDetails = () => {
        const modal = document.getElementById('channel_details_model');
        if (modal) {
            modal.showModal();
        } else {
            console.error("Modal element not found");
        }
    }

    useEffect(() => {
        fatchdata()
        fetchChannelVideos()
    }, [])

    useEffect(() => {
        setsubsciberCount(data?.subscribers.length || 0);
    }, [data])


    return (
        <div className=' px-2 sm:px-5 py-2 overflow-y-auto' id='scrollContainer'>
            {
                loader ? <ChannelSkeleton /> :
                    <div>
                        <div className=''>
                            <section className=' hidden sm:block'>
                                <img className=' w-[100%] h-44 rounded-3xl pt-2 object-cover'
                                    src={data?.banner_image} />
                            </section>

                            <section className=' grid grid-col-1 sm:grid-cols-[180px_auto] items-center my-4 mx-2'>
                                <section className=' flex sm:block justify-center'>
                                    <img className=' w-40 h-40  object-cover rounded-full'
                                        src={data?.profile_image} />
                                </section>
                                <section className=' '>
                                    <h1 className='mt-2 font-semibold text-3xl dark:text-white text-black'>{data?.name}</h1>
                                    <section className='leading-normal'>
                                        <h1 className='text-sm text-gray-500 mt-1'>
                                            {data?.description?.substring(0, 350)}
                                            <span onClick={() => showDetails()} className={`text-sm text-black dark:text-white cursor-pointer ${data?.description?.length > 350 ? "" : "hidden"}`}  >  . . . .</span>
                                        </h1>
                                    </section>

                                    <h1 className=' mt-1 dark:text-white text-black'> {subsciberCount} subscribers</h1>
                                    {
                                        userDetails && userDetails.subscribed && userDetails.subscribed.includes(id) ? (
                                            <button className='mt-1 text-white px-4 text-sm py-[4px] rounded-full' onClick={unsubscribe}>unsubscribe</button>
                                        ) : (
                                            <button className='mt-1 bg-white text-black px-4 text-sm py-[4px] rounded-full' onClick={subscribe}>subscribe</button>
                                        )
                                    }
                                </section>
                            </section>

                            <section className=' mt-2'>
                                <h1 className=' dark:text-white text-black'>Videos</h1>
                                <div className=' border-t border-gray-500 mt-1'></div>
                                <div className=''>
                                    {videoData?.length === 0 ? (
                                        <div className='w-[90vw] flex justify-center items-center flex-col mt-[-15px]'>
                                            <img src={noData} className='w-40 h-40' alt="No data" />
                                            <h1 className='dark:text-white text-black'>No video Found</h1>
                                        </div>
                                    ) : (
                                        < InfiniteScroll
                                            dataLength={videoData?.length ? videoData.length : 0}
                                            next={fetchMore}
                                            hasMore={moreData}
                                            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2'
                                            loader={
                                                <>
                                                    <VideoCardSkeleton />
                                                    <VideoCardSkeleton />
                                                    <VideoCardSkeleton />
                                                    <VideoCardSkeleton />
                                                </>
                                            }
                                            scrollableTarget="scrollContainer"
                                        >
                                            {
                                                videoData?.map((item, index) => (
                                                    <VideoCard type="all" key={index} data={item} channel={{ _id: data._id, name: data.name, profile: data.profile_image }} />
                                                ))
                                            }
                                        </InfiniteScroll>
                                    )}
                                </div>
                            </section>
                        </div>

                        <dialog id="loginchannelModel" className="modal">
                            <div className="modal-box bg-white dark:bg-black">
                                <h3 className="text-lg dark:text-white text-black">Login to subscribe</h3>
                                <div className=' flex justify-end gap-2'>
                                    <button onClick={(e) => {
                                        navigate("/Auth/login")
                                    }} className='hover:bg-red-800 dark:hover:bg-red-800 dark:hover:text-white text-sm hover:text-white px-4 py-[6px] rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white'>login</button>
                                    <button onClick={(e) => {
                                        document.getElementById('loginchannelModel').close()
                                    }
                                    } className='dark:hover:bg-red-800 text-sm dark:hover:text-white hover:bg-red-800 hover:text-white px-4 py-[6px] rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white'>Cancel</button>
                                </div>
                            </div>
                        </dialog>


                        <dialog id="channel_details_model" className="modal">
                            <div className="modal-box bg-white text-black dark:bg-medium_black dark:text-white sm:max-w-[90vh] sm:max-h-[700vh] max-w-[90svh] max-h-[70svh]">
                                <div>
                                    <button className="btn btn-md btn-circle btn-ghost text-lg absolute right-2 top-2" onClick={() => document.getElementById('channel_details_model').close()}>✕</button>
                                    <h1 className='text-lg font-semibold'>About</h1>
                                    <p className=' text-sm mt-3'>{data?.name}</p>
                                    <p className=' text-xs mt-1 text-gray-500'>{data?.description}</p>
                                    <h1 className=' my-4'>Channel Details</h1>
                                    <section className=' flex flex-col gap-3'>
                                        <section className='sm:hidden flex items-center gap-3'>
                                            <FiLink size={17} />
                                            <h1 className=' text-sm'>{path.length > 35 ? path.substring(0, 35) + "..." : path.substring(0, 35)}</h1>
                                        </section>
                                        <section className='hideen sm:flex items-center gap-3'>
                                            <FiLink size={17} />
                                            <h1 className=' text-sm'>{path}</h1>
                                        </section>
                                        <section className='flex items-center gap-3'>
                                            <MdOutlineVideoLibrary size={17} />
                                            <h1 className='text-sm'>{data?.videos?.length}  videos</h1>
                                        </section>
                                        <section className=' flex items-center gap-3'>
                                            <MdSupervisorAccount size={17} />
                                            <h1 className='text-sm'>{data?.subscribers?.length}  subscribers</h1>
                                        </section>
                                    </section>

                                    <section onClick={async () => {
                                        try {
                                            const copied = await navigator.clipboard.writeText(`http://localhost:5173/channel/${userDetails?.channel}`);
                                            toast.success('link copied to clipboard.')

                                        } catch (err) {
                                            toast.error('Somethinf went wrong.')
                                        }
                                    }}
                                        className=' cursor-pointer flex items-center text-sm w-28 mt-4 gap-2 rounded-3xl dark:bg-light_black bg-gray-200 text-black dark:text-white px-4 py-[8px]'>
                                        <PiShareFatLight size={18} />share
                                    </section>
                                </div>
                            </div>
                        </dialog>
                    </div>
            }
        </div >
    )
}

export default ChannelIndex