import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { PiShareFatLight } from "react-icons/pi";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import CommentCard from './CommentCard';
import noData from "../../assets/noData.png"
import AuthHook from '../Context/AuthContext';
import toast from 'react-hot-toast'

function VideoIndex() {
    const pagePath = window.location.href;
    const { id } = useParams()
    const [videoData, setvideoData] = useState()
    const [channelData, setchannelData] = useState()
    const [hlsLink, sethlsLink] = useState()
    const { userDetails, token, getUserDetails } = AuthHook();
    const [subsciberCount, setsubsciberCount] = useState(0);
    const [likeState, setlikeState] = useState(false)
    const [commenttext, setcommenttext] = useState("")
    const [commentdata, setcommentdata] = useState()

    const getVideoData = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/video/getvideo/${id}`)
        setvideoData(res.data.data);
    }

    const getChannelData = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/channel/oneChannel/${videoData?.channel}`)
        setchannelData(res.data.data);
    }

    const getVideoURL = async () => {
        const res = await axios.post("http://localhost:3000/Image", { public_id: videoData?.public_id })
        console.log(res.data.hls_url, 8989);
        sethlsLink(res.data.hls_url)
    }

    const subscribe = async () => {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/channel/subscribe`, {
            channelId: channelData?._id
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

    const unsubscribe = async () => {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/channel/unsubscribe`, {
            channelId: channelData?._id
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
    }

    const like = async () => {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/video/like`, {
            "videoId": id
        }, {
            headers: {
                "authentication": `bearer ${token}`
            }
        })
        if (res.data.status) {
            getUserDetails();
            setlikeState(true)
            // setsubsciberCount(prevCount => prevCount + 1)
        } else {
            toast.error("someting went wrong...")
        }
    }

    const unlike = async () => {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/video/unlike`, {
            "videoId": id
        }, {
            headers: {
                "authentication": `bearer ${token}`
            }
        })
        if (res.data.status) {
            getUserDetails();
            // setsubsciberCount(prevCount => prevCount + 1)
            setlikeState(false)
        } else {
            toast.error("someting went wrong...")
        }

    }

    const addComment = async () => {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/comment/addComment`, {
            videoId: id,
            text: commenttext
        }, {
            headers: {
                "authentication": `bearer ${token}`
            }
        });
        if (res.data.status) {
            toast.success("comment added....");
            const newComment = res.data.data._id;
            console.log(newComment, 8989);
            setcommentdata(prevData => [newComment, ...prevData]);
        } else {
            toast.error("something went wrong...");
        }
        setcommenttext("");
    };

    const shareLink = async () => {
        console.log("bbdbehj");
        try {
            const copied = await navigator.clipboard.writeText(pagePath);
            toast.success('link copied to clipboard.')

        } catch (err) {
            toast.error('Somethinf went wrong.')
        }
    }



    useEffect(() => {
        getVideoData()
    }, [])

    useEffect(() => {
        getChannelData()
        getVideoURL()
        setlikeState(videoData?.likes.includes(userDetails?._id))
        setcommentdata(videoData?.comments)
    }, [videoData])

    useEffect(() => {
        setsubsciberCount(channelData?.subscribers.length || 0);
    }, [channelData])


    return (
        <div className=' flex flex-col md:flex-row pt-3 px-3 overflow-y-auto'>
            <div className=' w-[100%] md:w-[65%] pt-5 md:px-5 overflow-y-auto'>
                <section className=' w-full h-96 rounded-xl bg-medium_black pb-[2px] px-[2px] mb-2'>
                    <ReactPlayer
                        url={hlsLink}
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
                                <h1 className=' text-gray-500 text-sm'>{subsciberCount} subscribers</h1>
                            </section>
                            {
                                userDetails && userDetails.subscribed && userDetails.subscribed.includes(channelData?._id) ? (
                                    <section onClick={unsubscribe} className=' cursor-pointer rounded-3xl dark:bg-light_black bg-white text-black dark:text-white px-4 py-[8px]'>
                                        unsubscribe
                                    </section>
                                ) : (
                                    <section onClick={subscribe} className=' cursor-pointer rounded-3xl dark:bg-light_black bg-white text-black dark:text-white px-4 py-[8px]'>
                                        subscribe
                                    </section>
                                )
                            }
                        </section>
                        <section className=' flex items-center gap-3'>
                            {
                                likeState ? (
                                    <section onClick={unlike} className=' cursor-pointer flex items-center gap-2 rounded-3xl dark:bg-light_black bg-white text-black dark:text-white px-4 py-[8px]'>
                                        <AiFillLike size={19} />unlike
                                    </section>
                                ) : (
                                    <section onClick={like} className=' cursor-pointer flex items-center gap-2 rounded-3xl dark:bg-light_black bg-white text-black dark:text-white px-4 py-[8px]'>
                                        <AiOutlineLike size={19} />like
                                    </section>
                                )
                            }
                            <section onClick={shareLink}
                                className=' cursor-pointer flex items-center gap-2 rounded-3xl dark:bg-light_black bg-white text-black dark:text-white px-4 py-[8px]'>
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
                            <input type='text' value={commenttext} onChange={(e) => {
                                setcommenttext(e.target.value)
                            }} className=' focus:border-b-2 focus:outline-none w-[100%] border-b px-2 py-[5px] dark:bg-black bg-bg_white'
                                placeholder='Add a comment' />
                        </section>
                        <button onClick={addComment} className={`${commenttext.length > 0 ? " w-32 px-4 py-[5px]" : "w-[0px]"} overflow-hidden transition-all ease-in-out duration-300 dark:bg-light_black bg-white dark:text-white text-black  rounded-3xl mt-3`}>Comment</button>
                    </section>
                    <section>
                        {
                            commentdata?.length === 0 ? (
                                <div className='flex justify-center items-center mt-[-15px]'>
                                    <img src={noData} className='w-28 h-28' alt="No data" />
                                    <h1 className='dark:text-white text-black'>No comments</h1>
                                </div>
                            ) : (
                                commentdata?.map((item) => {

                                    return <CommentCard key={item} data={item} />
                                })
                            )
                        }
                    </section>
                </section>
            </div>
            <div className=' w-[35%]'>

            </div>
        </div>
    )
}

export default VideoIndex