import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { PiShareFatLight } from "react-icons/pi";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import CommentCard from './CommentCard';
import noData from "../../assets/noData.png"

function VideoIndex() {
    const { id } = useParams()
    const [videoData, setvideoData] = useState()
    const [channelData, setchannelData] = useState()

    const getVideoData = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/video/getvideo/${id}`)
        console.log(res.data.data);
        setvideoData(res.data.data);
    }

    const getChannelData = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/channel/oneChannel/${videoData?.channel}`)
        setchannelData(res.data.data);
    }

    useEffect(() => {
        getVideoData()
    }, [])

    useEffect(() => {
        getChannelData()
    }, [videoData])

    return (
        <div className=' flex flex-col md:flex-row pt-3 px-3 overflow-y-auto'>
            <div className=' w-[100%] md:w-[65%] pt-5 md:px-5 overflow-y-auto'>
                <section className=' w-full h-96 rounded-xl bg-medium_black p-1 mb-2'>
                    <ReactPlayer
                        url="https://res.cloudinary.com/dsq6bfksv/video/upload/v1/vidify_videos/arckqdlceauea5zmqbqn?_a=BAMHUyP80"
                        controls={true}
                        width="100%"
                        height="100%"
                        playing={true}
                    />
                </section>
                <section className=' py-1 px-2'>
                    <h1 className=' dark:text-white text-black text-2xl'>{videoData?.title}</h1>
                    <section className=' flex flex-col md:flex-row my-2 items-center justify-between'>
                        <section className=' flex items-center gap-2'>
                            <img className=' rounded-full w-12 h-12 object-cover'
                                src={channelData?.profile_image} />
                            <section className='my-1 mx-3'>
                                <h1 className=' dark:text-white text-black'>{channelData?.name}</h1>
                                <h1 className=' text-gray-500 text-sm'>{channelData?.subscribers.length} subscribers</h1>
                            </section>
                            <section className=' cursor-pointer rounded-3xl dark:bg-light_black bg-white text-black dark:text-white px-4 py-[8px]'>
                                subscribe
                            </section>
                        </section>
                        <section className=' flex items-center gap-3'>
                            <section className=' cursor-pointer flex items-center gap-2 rounded-3xl dark:bg-light_black bg-white text-black dark:text-white px-4 py-[8px]'>
                                <AiOutlineLike size={19} />like
                            </section>
                            <section className=' cursor-pointer flex items-center gap-2 rounded-3xl dark:bg-light_black bg-white text-black dark:text-white px-4 py-[8px]'>
                                <PiShareFatLight size={20} />share
                            </section>
                        </section>
                    </section>
                </section>

                <section className=' dark:bg-light_black bg-white p-3 rounded-xl my-3'>
                    <h1 className='text-gray-700 dark:text-gray-500'>500000 views</h1>
                    <p className=' text-black dark:text-white'>{videoData?.description}</p>
                </section>

                <section className=' py-2'>
                    <h1 className=' text-lg dark:text-white text-black'>{videoData?.comments?.length} comments</h1>
                    <section className=' my-3 flex flex-col items-end'>
                        <section className='flex gap-3 items-cente w-[100%]'>
                            <img className=' rounded-full w-10 h-10 object-cover'
                                src={channelData?.profile_image} />
                            <input type='text' className=' focus:border-b-2 focus:outline-none w-[100%] border-b px-2 py-[5px] dark:bg-black bg-bg_white'
                                placeholder='Add a comment' />
                        </section>
                        <button className='dark:bg-light_black bg-white dark:text-white text-black px-4 py-[5px] rounded-3xl mt-3'>Comment</button>
                    </section>
                    <section>
                        {
                            videoData?.comments?.length === 0 ? (
                                <div className='flex justify-center items-center mt-[-15px]'>
                                    <img src={noData} className='w-28 h-28' alt="No data" />
                                    <h1 className='dark:text-white text-black'>No comments</h1>
                                </div>
                            ) : (<CommentCard />)
                        }
                    </section>
                </section>
            </div>
            <div className=' w-[35%]'>

            </div>
        </div >
    )
}

export default VideoIndex