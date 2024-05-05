import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { PiShareFatLight } from "react-icons/pi";
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import CommentCard from './CommentCard';
import noData from "../../assets/noData.png"
import AuthHook from '../Context/AuthContext';
import toast from 'react-hot-toast'
import RelatedVideoCard from './RelatedVideoCard';
import RelatedVideoSkeleton from '../loaders/RelatedVideoSkeleton';
import logo from "../../assets/user_default.png"
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdSubscriptions } from "react-icons/md";

function VideoIndex() {
    const pagePath = window.location.href;
    const { id } = useParams()
    const [videoData, setvideoData] = useState()
    const [channelData, setchannelData] = useState()
    const [hlsLink, sethlsLink] = useState()
    const { userDetails, token, getUserDetails, islogedIn } = AuthHook();
    const [subsciberCount, setsubsciberCount] = useState(0);
    const [likeState, setlikeState] = useState(false)
    const [commenttext, setcommenttext] = useState("")
    const [commentdata, setcommentdata] = useState()
    const [relatedvideosdata, setrelatedvideosdata] = useState()
    const [relatedContentLoading, setrelatedContentLoading] = useState(false)
    const navigate = useNavigate();

    const views = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/video/views`, {
                videoId: id
            })
        } catch (err) {
            console.log(err);
        }
    }

    const watchHistory = async () => {
        if (islogedIn) {
            try {
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/video/watchHistory`, {
                    videoId: id,
                    topic: videoData?.topic
                }, {
                    headers: {
                        "authentication": `bearer ${token}`
                    }
                })

                console.log(res);
            } catch (err) {
                console.log(err);
            }
        }
    }

    useEffect(() => {
        setTimeout(() => {
            views()
            watchHistory()
        }, 15000);
    }, [])

    const getVideoData = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/video/getvideo/${id}`)
        setvideoData(res.data.data);
        setchannelData(res.data.data.channel);
    }

    const relatedVideos = async () => {
        setrelatedContentLoading(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/feed/relatedvideo/${id}`)
        setrelatedvideosdata(res.data.data);
        setrelatedContentLoading(false)
    }


    const getVideoURL = async () => {
        const res = await axios.post("http://localhost:3000/Image", { public_id: videoData?.public_id })
        sethlsLink(res.data.hls_url)
    }

    const subscribe = async () => {
        if (islogedIn) {
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
        } else {
            document.getElementById('loginvideoModel').showModal()
        }
    }

    const unsubscribe = async () => {
        if (islogedIn) {
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
        } else {
            document.getElementById('loginvideoModel').showModal()
        }
    }

    const like = async () => {
        if (islogedIn) {
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
            } else {
                toast.error("someting went wrong...")
            }
        } else {
            document.getElementById('loginlikeModel').showModal()
        }
    }

    const unlike = async () => {
        if (islogedIn) {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/video/unlike`, {
                "videoId": id
            }, {
                headers: {
                    "authentication": `bearer ${token}`
                }
            })
            if (res.data.status) {
                getUserDetails();
                setlikeState(false)
            } else {
                toast.error("someting went wrong...")
            }
        } else {
            document.getElementById('loginlikeModel').showModal()
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
            setcommentdata(prevData => [newComment, ...prevData]);
        } else {
            toast.error("something went wrong...");
        }
        setcommenttext("");
    };

    const shareLink = async () => {
        try {
            const copied = await navigator.clipboard.writeText(pagePath);
            toast.success('link copied to clipboard.')

        } catch (err) {
            toast.error('Somethinf went wrong.')
        }
    }

    useEffect(() => {
        getVideoData()
        relatedVideos()
    }, [])

    useEffect(() => {
        getVideoURL()
        setlikeState(videoData?.likes.includes(userDetails?._id))
        setcommentdata(videoData?.comments)
    }, [videoData])

    useEffect(() => {
        setsubsciberCount(channelData?.subscribers.length || 0);
    }, [channelData])



    return (
        <div className=' flex flex-col md:flex-row pt-3 px-3 overflow-y-auto'>
            <div className=' w-[100%] min-[980px]:w-[70%] pt-5 md:px-5 overflow-y-auto'>
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
                    <section className=' flex flex-col md:flex-row my-2 items-center justify-between '>
                        <section className=' flex items-center justify-between sm:justify-normal  w-full'>
                            <div className=' flex'>
                                <img className=' rounded-full w-12 h-12 object-cover'
                                    src={channelData?.profile_image} />
                                <section className='my-1 mx-3'>
                                    <h1 className=' dark:text-white text-black'>{channelData?.name}</h1>
                                    <h1 className=' text-gray-600 text-sm'>{subsciberCount} {subsciberCount > 1 ? "subscribers" : "subscriber"}</h1>
                                </section>
                            </div>
                            {
                                userDetails && userDetails.subscribed && userDetails.subscribed.includes(channelData?._id) ? (
                                    <section onClick={unsubscribe} className=' flex items-center gap-2 cursor-pointer rounded-3xl dark:bg-light_black bg-white text-black dark:text-white px-4 py-[4px]'>
                                        <MdSubscriptions size={15} />unsubscribe
                                    </section>
                                ) : (
                                    <section onClick={subscribe} className='flex items-center gap-2 cursor-pointer rounded-3xl dark:bg-light_black bg-white text-black dark:text-white px-4 py-[4px]'>
                                        <MdOutlineSubscriptions size={15} />subscribe
                                    </section>
                                )
                            }
                        </section>
                        <section className=' flex items-center justify-end w-[100%] md:w-auto gap-3'>
                            {
                                likeState ? (
                                    <section onClick={unlike} className=' cursor-pointer flex items-center gap-2 rounded-3xl dark:bg-light_black bg-white text-black dark:text-white px-4 py-[4px]'>
                                        <AiFillLike size={19} />unlike
                                    </section>
                                ) : (
                                    <section onClick={like} className=' cursor-pointer flex items-center gap-2 rounded-3xl dark:bg-light_black bg-white text-black dark:text-white px-4 py-[4px]'>
                                        <AiOutlineLike size={19} />like
                                    </section>
                                )
                            }
                            <section onClick={shareLink}
                                className=' cursor-pointer flex items-center gap-2 rounded-3xl dark:bg-light_black bg-white text-black dark:text-white px-4 py-[4px]'>
                                <PiShareFatLight size={20} />share
                            </section>
                        </section>
                    </section>
                </section>

                <section className=' dark:bg-light_black bg-white p-3 rounded-xl my-3'>
                    <h1 className='text-gray-700 dark:text-gray-500'>{videoData?.views} {videoData?.views > 1 || videoData?.views == 0 ? "views" : "view"}</h1>
                    <p className=' text-black dark:text-white text-sm'>{videoData?.description}</p>
                </section>

                <section className=' py-2'>
                    <h1 className=' text-lg dark:text-white text-black'>{videoData?.comments?.length} comments</h1>
                    <section className=' my-3 flex flex-col items-end'>
                        <section className='flex gap-3 items-cente w-[100%]'>
                            <img className=' rounded-full w-10 h-10 object-cover'
                                src={userDetails?.profile_image ? userDetails.profile_image : logo} />
                            <input type='text' value={commenttext} onChange={(e) => {
                                setcommenttext(e.target.value)
                            }} className=' focus:border-b-2 focus:outline-none w-[100%] dark:text-gray-400 text-gray-700 border-b px-2 py-[5px] bg-transparent'
                                placeholder='Add a comment' />
                        </section>
                        <button onClick={addComment} className={`${commenttext.length > 0 ? " w-28 py-[5px]" : "w-[0px]"} text-sm overflow-hidden transition-all ease-in-out duration-300 dark:bg-light_black bg-white dark:text-white text-black  rounded-3xl mt-3`}>Comment</button>
                    </section>
                    <section>
                        {
                            commentdata?.length === 0 ? (
                                <div className='flex flex-col justify-center items-center mt-[-15px]'>
                                    <img src={noData} className='w-56 h-56 ' alt="No data" />
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
            <div className=' hidden min-[980px]:block min-[980px]:w-[30%] min-[1100px]:pr-6 py-2'>
                <h1 className=' dark:text-white text-black fixed'>Related Content</h1>
                <div className='overflow-y-auto h-full mt-7'>
                    {relatedContentLoading ? (
                        <section>
                            {[...Array(5)].map((_, index) => (
                                <RelatedVideoSkeleton key={index} />
                            ))}
                        </section>
                    ) : relatedvideosdata?.length === 0 ? (
                        <div className='w-90vw h-90vh flex justify-center items-center flex-col mt-[-15px] py-5'>
                            <img src={noData} className='w-32 h-32' alt="No data" />
                            <h1 className='dark:text-white text-black text-sm'>No video Found</h1>
                        </div>
                    ) : (
                        relatedvideosdata?.map(item => (
                            <RelatedVideoCard key={item._id} data={item} />
                        ))
                    )}
                </div>

            </div>

            <dialog id="loginvideoModel" className="modal">
                <div className="modal-box bg-white dark:bg-black">
                    <h3 className="text-lg dark:text-white text-black">Login to subscribe</h3>
                    <div className=' flex justify-end gap-2'>
                        <button onClick={(e) => {
                            navigate("/Auth/login")
                        }} className='hover:bg-red-800 dark:hover:bg-red-800 dark:hover:text-white text-sm hover:text-white px-4 py-[6px] rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white'>login</button>
                        <button onClick={(e) => {
                            document.getElementById('loginvideoModel').close()
                        }
                        } className='dark:hover:bg-red-800 text-sm dark:hover:text-white hover:bg-red-800 hover:text-white px-4 py-[6px] rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white'>Cancel</button>
                    </div>
                </div>
            </dialog>

            <dialog id="loginlikeModel" className="modal">
                <div className="modal-box bg-white dark:bg-black">
                    <h3 className="text-lg dark:text-white text-black">Login to like</h3>
                    <div className=' flex justify-end gap-2'>
                        <button onClick={(e) => {
                            navigate("/Auth/login")
                        }} className='hover:bg-red-800 dark:hover:bg-red-800 dark:hover:text-white text-sm hover:text-white px-4 py-[6px] rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white'>login</button>
                        <button onClick={(e) => {
                            document.getElementById('loginlikeModel').close()
                        }
                        } className='dark:hover:bg-red-800 text-sm dark:hover:text-white hover:bg-red-800 hover:text-white px-4 py-[6px] rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white'>Cancel</button>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default VideoIndex