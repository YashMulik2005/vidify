import React, { useEffect, useRef, useState } from 'react';
import { MdCloudUpload } from "react-icons/md";
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';
import AuthHook from '../Context/AuthContext';
import VideoCard from '../videos/VideoCard';
import createChannel from '../../assets/createChannel.png';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import noData from '../../assets/noData.png';
import { MoonLoader } from 'react-spinners'
import ModelLoader from '../home/ModelLoader';
import { IoIosArrowForward } from "react-icons/io";
import { FiLink } from "react-icons/fi";
import { MdOutlineVideoLibrary, MdSupervisorAccount } from "react-icons/md";
import { PiShareFatLight } from "react-icons/pi";
import ChannelSkeleton from '../loaders/ChannelSkeleton';
import Unauthorized from '../../errors/Unauthorized';
import { IoIosCamera } from "react-icons/io";
import InfiniteScroll from 'react-infinite-scroll-component';
import VideoCardSkeleton from '../loaders/VideoCardSkeleton';

function YourChannel() {
    const [data, setdata] = useState();
    // Edit video state
    const imageRef = useRef(null);
    const videoRef = useRef(null);
    const [category, setCategory] = useState([]);
    const [thumbnail, setThumbnail] = useState();
    const [video, setVideo] = useState();
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [selectedTopicIds, setSelectedTopicIds] = useState([]);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [thumbnailName, setThumbnailName] = useState("");
    const [videoFileName, setVideoFileName] = useState("");
    // Create channel states
    const [channelSelectedTopics, setChannelSelectedTopics] = useState([]);
    const [channelSelectedTopicIds, setChannelSelectedTopicIds] = useState([]);
    const [channelBanner, setChannelBanner] = useState();
    const [channelProfile, setChannelProfile] = useState();
    const [bannerName, setBannerName] = useState('');
    const [profileName, setProfileName] = useState('');
    const [channelName, setChannelName] = useState('');
    const [channelDesc, setChannelDesc] = useState('');
    const bannerRef = useRef(null);
    const profileRef = useRef(null);
    const [errorCreate, setErrorCreate] = useState({
        name: false, desc: false, banner: false, profile: false, topic: false
    });
    const [addVideoError, setaddVideoError] = useState(false)
    const [channelLoader, setChannelLoader] = useState(false);
    const [videoLoader, setVideoLoader] = useState(false);

    const { userDetails, token, setuserDetailsLoader, islogedIn } = AuthHook();

    const [loader, setloader] = useState(false)
    //edit channel states
    const channelProfileRef = useRef(null)
    const channelBannerRef = useRef(null)
    const [channelProfileEdit, setchannelProfileEdit] = useState()
    const [channelBannerEdit, setchannelBannerEdit] = useState()
    const [channelProfilePreviewURL, setchannelProfilePreviewURL] = useState(null)
    const [channelBannerPreviewURL, setchannelBannerPreviewURL] = useState(null)
    const [editloader, seteditloader] = useState()

    //video data states
    const [videoData, setvideoData] = useState()
    const [currentPage, setcurrentPage] = useState(0)
    const [moreData, setmoreData] = useState(false)

    const handleChannelProfileEdit = (e) => {
        const selectedFile = e.target.files[0]
        setchannelProfileEdit(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = () => {
                setchannelProfilePreviewURL(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
        document.getElementById('profilePreviewModal').showModal()
    };
    const handleChannelBannerEdit = (e) => {
        const selectedFile = e.target.files[0]
        setchannelBannerEdit(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = () => {
                setchannelBannerPreviewURL(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
        document.getElementById('BannerPreviewModal').showModal()
    };

    const updateChannelProfile = async () => {
        try {
            seteditloader(true);
            const profilelData = new FormData();
            profilelData.append("file", channelProfileEdit);
            profilelData.append("upload_preset", "vidify_image_preset");
            const profileRes = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, profilelData);
            const profileUrl = profileRes.data.secure_url;
            console.log(profileUrl);

            const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/channel/updateProfile`, {
                profile: profileUrl,
                channelId: userDetails?.channel
            }, {
                headers: {
                    authentication: `bearer ${token}`
                }
            })
            if (res.status) {
                toast.success("profile photo updated sucessfully..")
                document.getElementById('profilePreviewModal').close()
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
            toast.error("somthing went wrong try again..")
        }
        seteditloader(false);
    }

    const updateChannelBanner = async () => {
        try {
            seteditloader(true);
            const profilelData = new FormData();
            profilelData.append("file", channelBannerEdit);
            profilelData.append("upload_preset", "vidify_image_preset");
            const profileRes = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, profilelData);
            const profileUrl = profileRes.data.secure_url;
            console.log(profileUrl);

            const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/channel/updateBanner`, {
                banner: profileUrl,
                channelId: userDetails?.channel
            }, {
                headers: {
                    authentication: `bearer ${token}`
                }
            })
            if (res.status) {
                toast.success("profile photo updated sucessfully..")
                document.getElementById('BannerPreviewModal').close()
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
            toast.error("somthing went wrong try again..")
        }
        seteditloader(false);
    }

    const handleVideoChange = (e) => {
        setaddVideoError(false)
        setVideo(e.target.files[0]);
        setVideoFileName(e.target.files[0].name);
    };

    const handleThumbnailChange = (e) => {
        setaddVideoError(false)
        setThumbnail(e.target.files[0]);
        setThumbnailName(e.target.files[0].name);
    };

    const handleTopicSelect = (selectedList) => {
        setaddVideoError(false)
        const selectedIds = selectedList.map(item => item._id);
        setSelectedTopics(selectedList);
        setSelectedTopicIds(selectedIds);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (title === "" || desc === "" || video === undefined || thumbnail === undefined || selectedTopicIds.length === 0) {
            setaddVideoError(true);
        } else {
            setVideoLoader(true)
            setuserDetailsLoader(true);
            setaddVideoError(false);
            const thambnailData = new FormData();
            thambnailData.append("file", thumbnail);
            thambnailData.append("upload_preset", "vidify_image_preset");
            const thambnailRes = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, thambnailData);
            const thambnailUrl = thambnailRes.data.secure_url;
            console.log(thambnailUrl);

            const videoData = new FormData();
            videoData.append("file", video);
            videoData.append("upload_preset", "vidify_video_preset");
            const videoRes = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/video/upload`, videoData);
            const videoUrl = videoRes.data.secure_url;
            const videoPublicId = videoRes.data.public_id;
            console.log(videoUrl);
            console.log(videoPublicId);

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/video/addVideo`, {
                title: title,
                description: desc,
                thambnail: thambnailUrl,
                video: videoUrl,
                topic: selectedTopicIds,
                channel: userDetails.channel,
                public_id: videoPublicId
            }, {
                headers: {
                    "authentication": `bearer ${token}`
                }
            });

            if (res.data.status) {
                document.getElementById('my_modal_3').close();
                toast.success("Video uploaded successfully.");
                window.location.reload();
            }
            setVideoLoader(false)
            setuserDetailsLoader(false)
        }
    };

    const handleChannelTopicSelect = (selectedList) => {
        setErrorToInitial();
        const selectedIds = selectedList.map(item => item._id);
        setChannelSelectedTopics(selectedList);
        setChannelSelectedTopicIds(selectedIds);
    };

    const handleProfileChange = (e) => {
        setErrorToInitial();
        setChannelProfile(e.target.files[0]);
        setProfileName(e.target.files[0].name);
    };

    const handleBannerChange = (e) => {
        setErrorToInitial();
        setChannelBanner(e.target.files[0]);
        setBannerName(e.target.files[0].name);
    };

    const setErrorToInitial = () => {
        let updatedErrors = {
            name: false, desc: false, banner: false, profile: false, topic: false
        };
        setErrorCreate(updatedErrors);
    };


    const setError = () => {
        let updatedErrors = {
            name: false, desc: false, banner: false, profile: false, topic: false
        };

        if (!channelBanner) {
            updatedErrors.banner = true;
        }

        if (!channelProfile) {
            updatedErrors.profile = true;
        }

        if (!channelName.trim()) {
            updatedErrors.name = true;
        }

        if (!channelDesc.trim()) {
            updatedErrors.desc = true;
        }

        if (channelSelectedTopicIds.length === 0) {
            updatedErrors.topic = true;
        }

        setErrorCreate(updatedErrors);
    };


    const handleCreateChannel = async (e) => {
        e.preventDefault();
        setChannelLoader(true);
        setError();
        if (!errorCreate.name && !errorCreate.desc && !errorCreate.banner && !errorCreate.profile && !errorCreate.topic) {
            try {
                const profileData = new FormData();
                profileData.append("file", channelProfile);
                profileData.append("upload_preset", "vidify_image_preset");
                const profileRes = await axios.post(`https://api.cloudinary.com/v1_1/dsq6bfksv/image/upload`, profileData);
                const profileImageUrl = profileRes.data.secure_url;

                const bannerData = new FormData();
                bannerData.append("file", channelBanner);
                bannerData.append("upload_preset", "vidify_image_preset");
                const bannerRes = await axios.post(`https://api.cloudinary.com/v1_1/dsq6bfksv/image/upload`, bannerData);
                const bannerImageUrl = bannerRes.data.secure_url;

                // Create channel
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/channel/createChannel`, {
                    name: channelName,
                    description: channelDesc,
                    profile_image: profileImageUrl,
                    banner_image: bannerImageUrl,
                    categories: channelSelectedTopicIds
                }, {
                    headers: {
                        "authentication": `bearer ${token}`
                    }
                });

                if (res.data.status) {
                    document.getElementById('my_modal_4').close();
                    toast.success("Channel created successfully.");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            } catch (error) {
                console.error("Error creating channel:", error);
                toast.error("Failed to create channel.");
            }
        }
        setChannelLoader(false);
    };

    const fetchData = async () => {
        setloader(true)
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/channel/oneChannel/${userDetails?.channel}`);
            setdata(res.data.data);
        } catch (error) {
            console.error("Error fetching channel data:", error);
        }
        setloader(false)
    };

    const fetchChannelVideos = async () => {
        // setloader(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/video/channel/${userDetails?.channel}?limit=4`)
        setcurrentPage(res.data.response.currentPage);
        setmoreData(res.data.response.moreData)
        setvideoData(res.data.response.data)
        // setloader(false)
    }

    const fetchMore = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/video/channel/${userDetails?.channel}?limit=4&page=${currentPage + 1}`)
        setcurrentPage(res.data.response.currentPage);
        setmoreData(res.data.response.moreData)
        setvideoData(prev => [...prev, ...res.data.response.data])
    }

    const getCategory = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/category/getCategory");
            setCategory(res.data.data.category);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const showDetails = () => {
        const modal = document.getElementById('details_model');
        if (modal) {
            modal.showModal();
        } else {
            console.error("Modal element not found");
        }
    }

    useEffect(() => {
        if (userDetails?.channel) {
            fetchData();
            fetchChannelVideos();
        }
        getCategory();
    }, [userDetails]);

    return (
        <div className='overflow-y-auto w-full h-full' id='scrollContainer'>
            {
                !islogedIn ? <Unauthorized msg="channel details" /> :
                    userDetails?.channel ? loader ? <ChannelSkeleton /> : (
                        <div>
                            <div className=' px-2 sm:px-5 py-2'>
                                <section className='hidden sm:block relative'>
                                    <img className='w-[100%] h-44 object-cover rounded-3xl pt-2' src={data?.banner_image} alt="Channel banner" />
                                    <section onClick={() => {
                                        channelProfileRef.current.click()
                                    }} className='absolute top-5 cursor-pointer right-2 dark:bg-black bg-bg_white rounded-full p-1'><IoIosCamera color='dark:white black' size={25} /></section>
                                    <input ref={channelProfileRef} type="file" id="profile" name="profile" className="hidden absolute inset-0" accept="image/*" onChange={handleChannelBannerEdit} />
                                </section>

                                <section className='grid grid-cols-1 sm:grid-cols-[180px_auto] items-center my-4 mx-2'>
                                    <section className='flex sm:block justify-center relative '>
                                        <img className='w-40 h-40 object-cover rounded-full' src={data?.profile_image} alt="Channel profile" />
                                        <section onClick={() => {
                                            channelBannerRef.current.click()
                                        }} className='absolute bottom-2 cursor-pointer right-24 sm:right-6 dark:bg-black bg-bg_white rounded-full p-1'><IoIosCamera color='dark:white black' size={25} /></section>
                                        <input ref={channelBannerRef} type="file" id="profile" name="profile" className="hidden absolute inset-0" accept="image/*" onChange={handleChannelProfileEdit} />
                                    </section>
                                    <section>
                                        <h1 className='mt-2 font-semibold text-3xl dark:text-white text-black'>{data?.name}</h1>
                                        <section className='leading-normal'>
                                            <h1 className='text-sm text-gray-500 mt-1'>
                                                {data?.description?.substring(0, 350)}
                                                <span onClick={() => showDetails()} className={`text-sm text-black dark:text-white cursor-pointer ${data?.description?.length > 350 ? "" : "hidden"}`}  >  . . . .</span>
                                            </h1>
                                        </section>
                                        <h1 className='mt-1 dark:text-white text-black'>{data?.subscribers.length} subscribers</h1>
                                        <button className='mt-1 bg-red-500 text-white text-sm px-5 py-[4px] rounded-full' onClick={() => document.getElementById('my_modal_3').showModal()}>Post New Video</button>
                                    </section>
                                </section>

                                <section className='mt-2'>
                                    <h1 className='dark:text-white text-black'>Videos</h1>
                                    <div className='border-t border-gray-500 mt-1'></div>
                                    <div className=''>
                                        {data?.videos?.length === 0 ? (
                                            <div className='w-[90vw] flex justify-center items-center flex-col mt-[-15px]'>
                                                <img src={noData} className='w-40 h-40' alt="No data" />
                                                <h1 className='dark:text-white text-black'>No video Found</h1>
                                            </div>
                                        ) : (
                                            <InfiniteScroll
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
                                                        <VideoCard type="your" key={index} data={item} channel={{ _id: data._id, name: data.name, profile: data.profile_image }} />
                                                    ))
                                                }
                                            </InfiniteScroll>
                                        )}

                                    </div>
                                </section>
                            </div>

                            <dialog id="my_modal_3" className="modal">
                                <div className="modal-box bg-white text-black dark:bg-medium_black dark:text-white sm:max-w-[90vh] sm:max-h-[700vh] max-w-[90svh] max-h-[70svh]">
                                    <ModelLoader data={videoLoader} />
                                    <form method="dialog">
                                        <button className="btn btn-md btn-circle btn-ghost text-lg absolute right-2 top-2">✕</button>
                                    </form>
                                    <h1 className='text-lg font-semibold'>Add Video</h1>
                                    <h1 className={`${addVideoError ? "" : "hidden"} text-sm text-red-500`}>*All fileds are required</h1>
                                    <div className='overflow-y-auto p-2'>
                                        <form onSubmit={handleAdd}>
                                            <label className='text-sm'>Title: <span className=' text-red-500 text-xs'> *</span></label><br />
                                            <input value={title} onChange={(e) => {
                                                setaddVideoError(false)
                                                setTitle(e.target.value);
                                            }} className='px-3 text-sm py-[6px] rounded-lg bg-white dark:bg-light_black dark:border-none border w-[100%] focus:outline-none' type="text" id="title" name="title" /><br />

                                            <label className='text-sm'>Description: <span className=' text-red-500 text-xs'> *</span></label><br />
                                            <textarea value={desc} onChange={(e) => {
                                                setaddVideoError(false)
                                                setDesc(e.target.value);
                                            }} className='px-3 text-sm py-[5px] rounded-lg bg-white border dark:bg-light_black dark:border-none w-[100%] focus:outline-none' id="description" name="description" rows="4" cols="50"></textarea><br />

                                            <label className='text-sm mt-2'>Thumbnail Image: <span className=' text-red-500 text-xs'> *</span></label><br />
                                            <div className="flex items-center justify-between w-full dark:bg-light_black dark:border-none bg-white border rounded-lg px-3 py-[5px] focus:outline-none">
                                                <label onClick={() => {
                                                    imageRef.current.click();
                                                }} className="cursor-pointer flex items-center  gap-3 text-sm"><MdCloudUpload size={28} color='gray' />Choose Thumbnail File</label>
                                            </div>
                                            <h1 className='text-xs mt-1 text-gray-600'>{thumbnailName}</h1>

                                            <label className='text-sm mt-2'>Video: <span className=' text-red-500 text-xs'> *</span></label><br />
                                            <div className="flex items-center justify-between w-full dark:bg-light_black dark:border-none bg-white border rounded-lg px-3 py-[5px] focus:outline-none">
                                                <label onClick={() => {
                                                    videoRef.current.click();
                                                }} className="cursor-pointer flex items-center  gap-3 text-sm"><MdCloudUpload size={28} color='gray' />Choose Video File</label>
                                            </div>
                                            <h1 className='text-xs mt-1 text-gray-600'>{videoFileName}</h1>

                                            <label className='text-sm mt-2'>Select Topic: <span className=' text-red-500 text-xs'> *</span></label><br />
                                            <Multiselect
                                                options={category} videos
                                                selectedValues={selectedTopics}
                                                onSelect={handleTopicSelect}
                                                onRemove={handleTopicSelect}
                                                displayValue="name"
                                                closeOnSelect={false}
                                                className=' dark:text-black'
                                            /><br />

                                            <button className='bg-red-500 text-white px-5 py-[4px] rounded-full text-sm mt-2 focus:outline-none' type='submit'>Post Video</button>
                                        </form>
                                        <input ref={imageRef} type="file" id="thumbnail" name="thumbnail" className="hidden absolute inset-0" accept="image/*" onChange={handleThumbnailChange} />
                                        <input ref={videoRef} type="file" id="video" name="video" className="hidden absolute inset-0" accept="video/*" onChange={handleVideoChange} />
                                    </div>
                                </div>
                            </dialog>

                            <dialog id="details_model" className="modal">
                                <div className="modal-box bg-white text-black dark:bg-medium_black dark:text-white sm:max-w-[90vh] sm:max-h-[700vh] max-w-[90svh] max-h-[70svh]">
                                    <div>
                                        <button className="btn btn-md btn-circle btn-ghost text-lg absolute right-2 top-2" onClick={() => document.getElementById('details_model').close()}>✕</button>
                                        <h1 className='text-lg font-semibold'>About</h1>
                                        <p className=' text-sm mt-3'>{data?.name}</p>
                                        <p className=' text-xs mt-1 text-gray-500'>{data?.description}</p>
                                        <h1 className=' my-4'>Channel Details</h1>
                                        <section className=' flex flex-col gap-3'>
                                            <section className=' flex items-center gap-3'>
                                                <FiLink size={17} />
                                                <h1 className='  text-sm'>{window.location.href}</h1>
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
                                            className=' cursor-pointer flex items-center text-sm w-28 mt-4 gap-2 rounded-3xl dark:bg-light_black bg-white text-black dark:text-white px-4 py-[8px]'>
                                            <PiShareFatLight size={18} />share
                                        </section>
                                    </div>
                                </div>
                            </dialog>

                        </div>
                    ) : (

                        <div className='flex flex-col justify-center items-center h-full w-full gap-2'>
                            <section className='bg-white dark:bg-medium_black border dark:border-none p-3 sm:p-10 rounded-lg text-center'>
                                <img src={createChannel} className='w-80 h-80' alt="Create channel" />
                                <h1 className='font-semibold text-xl dark:text-white text-black'>You don't have a Channel</h1>
                                <p className='text-sm text-gray-500 '>Create one and post your videos</p>
                                <button className='bg-red-500 text-white px-4 py-[5px] rounded-lg my-2' onClick={() => {
                                    if (token) {
                                        document.getElementById('my_modal_4').showModal();
                                    } else {
                                        toast.error("Login first to create a channel.");
                                    }
                                }}>Create Channel</button>
                            </section>


                            <dialog id="my_modal_4" className="modal">
                                <div className="modal-box bg-white text-black dark:bg-medium_black dark:text-white sm:max-w-[90vh] sm:max-h-[85vh] max-w-[90svh] max-h-[85svh]">
                                    <ModelLoader data={channelLoader} />
                                    <form method="dialog">
                                        <button className="btn btn-md btn-circle btn-ghost text-lg absolute right-2 top-2">✕</button>
                                    </form>
                                    <h1 className='text-lg font-semibold'>Create Channel</h1>
                                    <div className='overflow-y-auto p-2'>
                                        <form onSubmit={handleCreateChannel}>
                                            <label className='text-sm'>Title:</label><br />
                                            <input value={channelName} onChange={(e) => {
                                                setErrorToInitial();
                                                setChannelName(e.target.value);
                                            }} className='px-3 py-[5px] rounded-lg bg-white dark:bg-light_black dark:border-none border w-[100%] focus:outline-none' type="text" id="title" name="title" />
                                            <h1 className={` ${errorCreate.name ? "" : "hidden"} text-xs text-red-500 m-[2px]`}>*name is required</h1>

                                            <label className='text-sm'>Description:</label><br />
                                            <textarea value={channelDesc} onChange={(e) => {
                                                setErrorToInitial();
                                                setChannelDesc(e.target.value);
                                            }} className='px-3 py-[5px] text-sm rounded-lg bg-white border dark:bg-light_black dark:border-none w-[100%] focus:outline-none' id="description" name="description" rows="4" cols="50"></textarea>
                                            <h1 className={` ${errorCreate.desc ? "" : "hidden"} text-xs text-red-500 m-[2px]`}>*description is required</h1>

                                            <label className='text-sm mt-2'>Profile Image</label><br />
                                            <div className="flex items-center justify-between w-full dark:bg-light_black dark:border-none bg-white border rounded-lg px-3 py-[5px] focus:outline-none">
                                                <label onClick={() => {
                                                    profileRef.current.click();
                                                }} className="cursor-pointer flex items-center  gap-3 text-sm"><MdCloudUpload size={28} color='gray' />Choose profile image</label>
                                            </div>
                                            <h1 className='text-xs mt-1 text-gray-600'>{profileName}</h1>
                                            <h1 className={` ${errorCreate.profile ? "" : "hidden"} text-xs text-red-500 m-[2px]`}>*profile is required</h1>

                                            <label className='text-sm mt-2'>Banner of Channel</label><br />
                                            <div className="flex items-center justify-between w-full dark:bg-light_black dark:border-none bg-white border rounded-lg px-3 py-[5px] focus:outline-none">
                                                <label onClick={() => {
                                                    bannerRef.current.click();
                                                }} className="cursor-pointer flex items-center  gap-3 text-sm"><MdCloudUpload size={28} color='gray' />Choose banner image</label>
                                            </div>
                                            <h1 className='text-sm mt-1 text-gray-600'>{bannerName}</h1>
                                            <h1 className={` ${errorCreate.banner ? "" : "hidden"} text-xs text-red-500 m-[2px]`}>*banner image is required</h1>

                                            <label className='text-sm mt-2'>Topics:</label><br />
                                            <Multiselect
                                                style={{ borderWidth: '0px' }}
                                                selectedValues={channelSelectedTopics}
                                                options={category}
                                                displayValue="name"
                                                onSelect={handleChannelTopicSelect}
                                                onRemove={handleChannelTopicSelect}
                                            />
                                            <h1 className={` ${errorCreate.topic ? "" : "hidden"} text-xs text-red-500 m-[2px]`}>*category is required</h1><br />

                                            <button type='submit' className='bg-red-500 rounded-lg cursor-pointer text-white px-4 py-[4px]'>{channelLoader ? <BeatLoader color="#FFF" size={8} /> : "Create Channel"}</button>
                                        </form>
                                        <input ref={profileRef} type="file" id="profile" name="profile" className="hidden absolute inset-0" accept="image/*" onChange={handleProfileChange} />
                                        <input ref={bannerRef} type="file" id="banner" name="banner" className="hidden absolute inset-0" accept="image/*" onChange={handleBannerChange} />
                                    </div>
                                </div>
                            </dialog>

                        </div>
                    )
            }
            <dialog id="profilePreviewModal" className="modal">
                <div className="modal-box bg-white text-black dark:bg-medium_black dark:text-white sm:max-w-[50vh] sm:max-h-[85vh] max-w-[80svh] max-h-[85svh]">
                    {
                        editloader
                            ? <div className=' h-[35vh] flex justify-center items-center flex-col gap-2'><BeatLoader color='red' /></div> :
                            <div>
                                <h1 className=' mb-1'>Profile Preview</h1>
                                <div>
                                    {channelProfilePreviewURL && <img src={channelProfilePreviewURL} className=' w-28 h-28 rounded-full m-auto border ' alt="Preview" />}
                                </div>
                                <div className=' flex justify-end gap-2 mt-3'>
                                    <button onClick={updateChannelProfile} className='hover:bg-red-700 dark:hover:bg-red-700 dark:hover:text-white text-xs hover:text-white px-3 py-[4px] rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white'>Set Image</button>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        setchannelProfileEdit(null);
                                        setchannelProfilePreviewURL(null);
                                        channelProfileRef.current.value = "";
                                        document.getElementById('profilePreviewModal').close()
                                    }
                                    } className='dark:hover:bg-red-700 text-xs dark:hover:text-white hover:bg-red-700 hover:text-white px-3 py-[4px] rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white'>Cancel</button>
                                </div>
                            </div>
                    }

                </div>
            </dialog>

            <dialog id="BannerPreviewModal" className="modal">
                <div className="modal-box bg-white text-black dark:bg-medium_black dark:text-white sm:max-w-[60vh] sm:max-h-[85vh] max-w-[90svh] max-h-[85svh]">
                    {
                        editloader
                            ? <div className=' h-[35vh] flex justify-center items-center flex-col gap-2'><BeatLoader color='red' /></div> :
                            <div>
                                <h1 className=' mb-1'>Banner Preview</h1>
                                <div>
                                    {channelBannerPreviewURL && <img src={channelBannerPreviewURL} className=' w-full h-28 object-cover m-auto border ' alt="Preview" />}
                                </div>
                                <div className=' flex justify-end gap-2 mt-3'>
                                    <button onClick={updateChannelBanner} className='hover:bg-red-700 dark:hover:bg-red-700 dark:hover:text-white text-xs hover:text-white px-3 py-[4px] rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white'>Set Image</button>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        setchannelBannerEdit(null);
                                        setchannelBannerPreviewURL(null);
                                        channelBannerRef.current.value = "";
                                        document.getElementById('BannerPreviewModal').close()
                                    }
                                    } className='dark:hover:bg-red-700 text-xs dark:hover:text-white hover:bg-red-700 hover:text-white px-3 py-[4px] rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white'>Cancel</button>
                                </div>
                            </div>
                    }
                </div>
            </dialog>
        </div>
    );
}

export default YourChannel;
