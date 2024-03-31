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

    const { userDetails, token, userDetailsLoader, setuserDetailsLoader } = AuthHook();

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
            const thambnailRes = await axios.post(`https://api.cloudinary.com/v1_1/dsq6bfksv/image/upload`, thambnailData);
            const thambnailUrl = thambnailRes.data.secure_url;
            console.log(thambnailUrl);

            const videoData = new FormData();
            videoData.append("file", video);
            videoData.append("upload_preset", "vidify_video_preset");
            const videoRes = await axios.post(`https://api.cloudinary.com/v1_1/dsq6bfksv/video/upload`, videoData);
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
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
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
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/channel/oneChannel/${userDetails?.channel}`);
            setdata(res.data.data);
        } catch (error) {
            console.error("Error fetching channel data:", error);
        }
    };

    const getCategory = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/category/getCategory");
            setCategory(res.data.data.category);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        if (userDetails?.channel) {
            fetchData();
        }
        getCategory();
    }, [userDetails]);

    return (
        <div className='overflow-y-auto w-full h-full'>
            {
                userDetails?.channel ? (
                    <div>
                        <div className='px-5 py-2'>
                            <section className='hidden sm:block'>
                                <img className='w-[100%] h-44 object-fill rounded-3xl pt-2' src={data?.banner_image} alt="Channel banner" />
                            </section>

                            <section className='grid grid-cols-1 sm:grid-cols-[180px_auto] items-center my-4 mx-2'>
                                <section className='flex sm:block justify-center'>
                                    <img className='w-40 h-40 object-cover rounded-full' src={data?.profile_image} alt="Channel profile" />
                                </section>
                                <section>
                                    <h1 className='mt-2 font-semibold text-3xl dark:text-white text-black'>{data?.name}</h1>
                                    <h1 className='line-clamp-4 text-sm text-gray-500 mt-1'>{data?.description}</h1>
                                    <h1 className='mt-1 dark:text-white text-black'>{data?.subscribers.length} subscribers</h1>
                                    <button className='mt-1 bg-red-500 text-white text-sm px-5 py-[4px] rounded-full' onClick={() => document.getElementById('my_modal_3').showModal()}>Post New Video</button>
                                </section>
                            </section>

                            <section className='mt-2'>
                                <h1 className='dark:text-white text-black'>Videos</h1>
                                <div className='border-t border-gray-500 mt-1'></div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4'>
                                    {data?.videos?.length === 0 ? (
                                        <div className='w-[90vw] flex justify-center items-center flex-col mt-[-15px]'>
                                            <img src={noData} className='w-40 h-40' alt="No data" />
                                            <h1 className='dark:text-white text-black'>No video Found</h1>
                                        </div>
                                    ) : (
                                        data?.videos?.map((item, index) => (
                                            <VideoCard type="your" key={index} data={item} />
                                        ))
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
                                        }} className='px-3 py-[5px] rounded-lg bg-white dark:bg-light_black dark:border-none border w-[100%] focus:outline-none' type="text" id="title" name="title" /><br />

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
                                        <h1 className='text-sm mt-1 text-gray-600'>{videoFileName}</h1>

                                        <label className='text-sm mt-2'>Topics: <span className=' text-red-500 text-xs'> *</span></label><br />
                                        <Multiselect
                                            style={{ borderWidth: '0px' }}
                                            selectedValues={selectedTopics}
                                            options={category}
                                            displayValue="name"
                                            onSelect={handleTopicSelect}
                                            onRemove={handleTopicSelect}
                                        /><br />

                                        <button type='submit' className='bg-red-500 rounded-lg cursor-pointer text-white px-4 py-[4px]'>{videoLoader ? <BeatLoader color="#FFF" size={8} /> : "Upload"}</button>
                                    </form>
                                    <input ref={imageRef} type="file" id="thumbnail" name="thumbnail" className="hidden absolute inset-0" accept="image/*" onChange={handleThumbnailChange} />
                                    <input ref={videoRef} type="file" id="video" name="video" className="hidden absolute inset-0" accept="video/*" onChange={handleVideoChange} />
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
        </div>
    );
}

export default YourChannel;
