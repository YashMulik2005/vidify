import React, { useEffect, useRef, useState } from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { MdCloudUpload } from "react-icons/md";
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'
import moment from 'moment';
import AuthHook from '../Context/AuthContext';
import ModelLoader from '../home/ModelLoader';
import VideoCardSkeleton from '../loaders/VideoCardSkeleton';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function VideoCard({ type, data, channel }) {
    const { token } = AuthHook()
    const [videoOption, setvideoOption] = useState(false);
    const [category, setcategory] = useState([])
    const [selectedTopics, setselectedTopics] = useState([])
    const [selectedTopicIds, setselectedTopicIds] = useState([]);
    const [title, settitle] = useState("")
    const [desc, setdesc] = useState("")
    const [videoData, setVideoData] = useState()
    const [channelData, setchannelData] = useState()
    const imageRef = useRef(null);
    const [editError, seteditError] = useState(false);
    const [updateLoader, setupdateLoader] = useState(false)
    const [deleteLoader, setdeleteLoader] = useState(false)

    const navigate = useNavigate()

    const setFiledsToInitial = () => {
        settitle("");
        setdesc("")
        setselectedTopicIds([])
        setselectedTopics([])

    }

    const handleedit = async (e) => {
        e.preventDefault();
        setupdateLoader(true)
        if (title === "" || desc === "" || selectedTopicIds.length === 0) {
            seteditError(true);
        } else {
            const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/video/updatevideo/${data}`,
                { title: title, description: desc, topic: selectedTopicIds },
                {
                    headers: {
                        "authentication": `bearer ${token}`
                    }
                })
            //console.log(res);
            if (res.data.status) {
                document.getElementById('my_modal_1').close();
                toast.success("Video Information Edited sucessfully...")
                window.location.reload();
                setFiledsToInitial()
            } else {
                document.getElementById('my_modal_1').close();
                toast.success("Something went wrong")
                setFiledsToInitial()
            }
        }
        setupdateLoader(false)
    }

    const hadledelete = async (e) => {
        e.preventDefault()
        setdeleteLoader(true)
        const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/video/deletevideo/${data}`, {
            headers: {
                "authentication": `bearer ${token}`
            }
        })
        if (res.data.status) {
            document.getElementById('my_modal_2').close();
            toast.success("Video delete sucessfully...")
            window.location.reload();
        } else {
            document.getElementById('my_modal_2').close();
            toast.error("Something went wrong.")
        }
        setdeleteLoader(false)
    }
    const getCategory = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/category/getCategory?search=`)
        setcategory(res.data.data.category)
    }

    // const getVideoData = async () => {
    //     setVideoCardLoader(true)
    //     const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/video/getvideo/${data}`)
    //     setVideoData(res.data.data);
    //     setchannelData(res.data.data.channel);
    //     setVideoCardLoader(false)
    // }

    const handleThambnailchange = (e) => {
        setthambnail(e.target.files[0]);
        setThumbnailName(e.target.files[0].name);
    }

    const handleTopicSelect = (selectedList, selectedItem) => {
        seteditError(false)
        const selectedIds = selectedList.map(item => item._id);
        setselectedTopics(selectedList);
        setselectedTopicIds(selectedIds);
    }

    useEffect(() => {
        if (type == "your") {
            getCategory()
        }
        setVideoData(data)
        setchannelData(data.channel)
    }, [])

    return (
        <div className=' h-full w-full'>
            {
                <div className=' rounded-lg p-1 relative'>
                    <section onClick={() => navigate(`/video/${videoData._id}`)} className=' cursor-pointer'>
                        <section className={` ${type == "your" ? "" : "hidden"} absolute right-4 top-3 text-black  bg-white p-[6px] rounded-full `}>
                            {
                                <BsThreeDotsVertical size={15} className=' cursor-pointer' onClick={(e) => {
                                    e.stopPropagation();
                                    setvideoOption(true)
                                }} />
                            }
                        </section>
                        <section className={` ${videoOption ? "" : "hidden"} text-sm absolute right-4 top-3 text-black bg-white px-4 py-2 rounded-lg`} >
                            <h1 className=' cursor-pointer flex justify-end mx-[-2px]'><RxCross2 size={18} onClick={(e) => {
                                e.stopPropagation();
                                setvideoOption(false)
                            }} /></h1>
                            <h1 className=' cursor-pointer' onClick={(e) => {
                                e.stopPropagation();
                                settitle(channel.name)
                                setdesc(channel.description)
                                setselectedTopics(channel.categories)
                                setselectedTopicIds(channel?.categories?.map((item) => item._id))
                                document.getElementById('my_modal_1').showModal()
                                setvideoOption(false)
                            }}>Edit</h1>
                            <h1 className=' cursor-pointer' onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById('my_modal_2').showModal()
                                setvideoOption(false)
                            }}>Delete</h1>
                        </section>
                        <div>
                            <LazyLoadImage className=' rounded-lg aspect-video w-full object-fill'
                                src={videoData?.thumbnail} />
                        </div>
                    </section>
                    <div className=' grid grid-cols-[45px_auto] mt-2 gap-1'>
                        <LazyLoadImage className=' rounded-full  w-8 h-8 object-fill'
                            src={channelData?.profile_image ? channelData.profile_image : channel?.profile} />
                        <section >
                            <p className=' text-xs dark:text-white text-black'>
                                {videoData?.title.length > 60 ? videoData?.title.substring(0, 60) + "..." : videoData?.title.substring(0, 60)}
                            </p>
                            <p className=' text-xs text-gray-500'>{channelData?.name ? channelData.name : channel?.name}</p>
                            <section className=' mt-1 text-gray-600 flex text-[10px] justify-between items-center w-[full]'>
                                <p className=''>{videoData?.views} {videoData?.views > 1 || videoData?.views == 0 ? "views" : "view"}</p>
                                <p>{videoData?.time ? moment(videoData?.time).fromNow() : "---"}</p>
                            </section>
                        </section>
                    </div>


                    {/* update model */}
                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box bg-white text-black  dark:bg-medium_black dark:text-white sm:max-w-[90vh] sm:max-h-[700vh] max-w-[90svh] max-h-[70svh]" >
                            <ModelLoader data={updateLoader} />
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h1 className=' text-lg'>Edit Video Information</h1>
                            <h1 className={`${editError ? "" : "hidden"} text-sm text-red-500`}>*All fileds are required</h1>
                            <div className='overflow-y-auto p-2'>
                                <form onSubmit={handleedit}>
                                    <label className=' text-sm'>Title<span className=' text-red-500 text-xs'> *</span></label><br />
                                    <input value={title} onChange={(e) => {
                                        seteditError(false)
                                        settitle(e.target.value)
                                    }} className=' px-3 py-[5px] rounded-lg bg-white dark:bg-light_black dark:border-none border w-[100%] focus:outline-none' type="text" id="title" name="title" /><br />

                                    <label className=' text-sm'>Description<span className=' text-red-500 text-xs'> *</span></label><br />
                                    <textarea value={desc} onChange={(e) => {
                                        seteditError(false)
                                        setdesc(e.target.value)
                                    }} className=' text-sm px-3 py-[5px] rounded-lg bg-white border dark:bg-light_black dark:border-none w-[100%] focus:outline-none' id="description" name="description" rows="7" cols="50"></textarea><br />


                                    <label className=' text-sm'>Topics<span className=' text-red-500 text-xs'> *</span></label><br />
                                    <Multiselect
                                        style={{ borderWidth: '0px' }}
                                        selectedValues={selectedTopics}
                                        options={category}
                                        displayValue="name"
                                        onSelect={handleTopicSelect}
                                        onRemove={handleTopicSelect}
                                        className=' dark:text-black'
                                    />
                                    <h1 className=' text-xs mt-[2px] text-gray-500'>select topics for video</h1>
                                    <br />

                                    <button type="submit" className=' bg-red-500 rounded-lg  text-white px-4 py-[4px]' value="Submit">Edit</button>
                                </form>
                                <input ref={imageRef} type="file" id="thumbnail" name="thumbnail" className="hidden absolute inset-0 " accept="image/*" onChange={handleThambnailchange} />
                            </div>
                        </div>
                    </dialog>

                    {/* delete model */}
                    <dialog id="my_modal_2" className="modal">
                        <div className="modal-box bg-white text-black  dark:bg-medium_black dark:text-white sm:max-w-[90vh] sm:max-h-[700vh] max-w-[90svh] max-h-[70svh]">
                            <ModelLoader data={deleteLoader} />
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h3 className="font-bold text-lg">Delete Video</h3>
                            <p className="py-4">Are you sure ,you want to delete this video ? </p>
                            <form method="dialog">
                                <button className=' bg-red-500 text-white rounded-lg px-4 py-[6px]' onClick={hadledelete}>delete</button>
                            </form>
                        </div>
                    </dialog>
                </div >
            }
        </div >


    )
}

export default VideoCard