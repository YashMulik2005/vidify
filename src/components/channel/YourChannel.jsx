import React, { useEffect, useRef, useState } from 'react'
import VideoCard from '../videos/VideoCard'
import { MdCloudUpload } from "react-icons/md";
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';
import AuthHook from '../Context/AuthContext';
import createChannel from '../../assets/createChannel.png'
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners'

function YourChannel() {
    //edit video state
    const imageRef = useRef(null);
    const videoRef = useRef(null);
    const [category, setcategory] = useState([])
    const [thambnail, setthambnail] = useState();
    const [video, setvideo] = useState()
    const [selectedTopics, setselectedTopics] = useState([])
    const [selectedTopicIds, setselectedTopicIds] = useState([]);
    const [title, settitle] = useState("")
    const [desc, setdesc] = useState("")
    const [thumbnailName, setThumbnailName] = useState("");
    const [videoFileName, setVideoFileName] = useState("");
    //create channel states
    const [channelSelectedTopics, setChannelSelectedTopics] = useState([])
    const [channelselectedTopicIds, setChannelselectedTopicIds] = useState([]);
    const [channelBanner, setchannelBanner] = useState()
    const [channelProfile, setchannelProfile] = useState()
    const [bnnaerName, setbnnaerName] = useState('')
    const [profileName, setprofileName] = useState('')
    const [channelName, setchannelName] = useState('');
    const [channelDes, setchannelDes] = useState('')
    const bannerRef = useRef(null);
    const profileRef = useRef(null)
    const [errorCreate, seterrorCreate] = useState({
        name: false, des: false, banner: false, profile: false, topic: false
    })
    const [channelLoader, setchannelLoader] = useState(false)

    const { userDetails, token } = AuthHook();

    const handleVideochange = (e) => {
        setvideo(e.target.files[0]);
        setVideoFileName(e.target.files[0].name);
    }

    const handleThambnailchange = (e) => {
        setthambnail(e.target.files[0]);
        setThumbnailName(e.target.files[0].name);
    }

    const handleTopicSelect = (selectedList, selectedItem) => {
        const selectedIds = selectedList.map(item => item._id);
        setselectedTopics(selectedList);
        setselectedTopicIds(selectedIds);
    }

    const handleAdd = (e) => {
        e.preventDefault();
        const formdata = {
            title: title,
            description: desc,
            thambnail: thambnail,
            video: video,
            topic: selectedTopicIds
        }
        console.log(formdata);
    }

    const handleChannelTopicSelect = (selectedList, selectedItem) => {
        setErrorToInitial()
        const selectedIds = selectedList.map(item => item._id);
        setChannelSelectedTopics(selectedList);
        setChannelselectedTopicIds(selectedIds);
    }

    const handleProfilechange = (e) => {
        setErrorToInitial()
        setchannelProfile(e.target.files[0]);
        setprofileName(e.target.files[0].name);
    }

    const handleBannerchange = (e) => {
        setErrorToInitial()
        setchannelBanner(e.target.files[0]);
        setbnnaerName(e.target.files[0].name);
    }

    const setErrorToInitial = () => {
        let updatedErrors = {
            name: false,
            des: false,
            banner: false,
            profile: false,
            topic: false
        };
        seterrorCreate(updatedErrors)
    }
    const setError = () => {
        console.log(234567);
        let updatedErrors = {
            name: false,
            des: false,
            banner: false,
            profile: false,
            topic: false
        };

        if (channelBanner === undefined) {
            updatedErrors.banner = true;
        }

        if (channelProfile === undefined) {
            updatedErrors.profile = true;
        }

        if (!channelName.trim()) {
            updatedErrors.name = true;
        }

        if (!channelDes.trim()) {
            updatedErrors.des = true;
        }

        if (channelselectedTopicIds.length === 0) {
            updatedErrors.topic = true;
        }

        seterrorCreate(updatedErrors);
    };

    const handleCreateChannel = async (e) => {
        e.preventDefault();
        setchannelLoader(true)
        console.log("in form");
        setError();
        if (!errorCreate.name && !errorCreate.des && !errorCreate.banner && !errorCreate.profile && !errorCreate.topic) {

            let profiledata = new FormData();
            profiledata.append("file", channelProfile);
            profiledata.append("upload_preset", "vidify_image_preset");

            const profileres = await axios.post(`https://api.cloudinary.com/v1_1/dsq6bfksv/image/upload`, profiledata);
            console.log(profileres.data.secure_url, "profile");

            let bennerdata = new FormData();
            bennerdata.append("file", channelBanner);
            bennerdata.append("upload_preset", "vidify_image_preset");

            const bannerres = await axios.post(`https://api.cloudinary.com/v1_1/dsq6bfksv/image/upload`, bennerdata);
            console.log(bannerres.data.secure_url, "banner");

            const res = await axios.post("http://localhost:3000/api/channel/createChannel", {
                name: channelName,
                description: channelDes,
                profile_image: profileres.data.secure_url,
                banner_image: bannerres.data.secure_url,
                categories: channelselectedTopicIds
            }, {
                headers: {
                    "authentication": `bearer ${token}`
                }
            })
            console.log(res.data.msg);
            if (res.data.status) {
                document.getElementById('my_modal_4').close();
                toast.success("channel created sucessfully...")
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }
        setchannelLoader(false)
    };

    const getCategory = async () => {
        const res = await axios.get("http://localhost:3000/api/category/getCategory")
        setcategory(res.data.data.category)
    }

    useEffect(() => {
        getCategory()
    }, [])

    return (
        <div className=' overflow-y-auto w-full h-full'>
            {
                userDetails?.channel ? <div> <div className=' px-5 py-2 '>
                    <div>
                        <section className=' hidden sm:block'>
                            <img className=' w-[100%] h-44 rounded-3xl pt-2'
                                src='https://img.freepik.com/free-vector/high-tech-futuristic-lines-technology-banner_1017-23966.jpg' />
                        </section>

                        <section className=' grid grid-col-1 sm:grid-cols-[180px_auto] items-center my-4 mx-2'>
                            <section className=' flex sm:block justify-center'>
                                <img className=' w-40 h-40  object-contain rounded-full'
                                    src='https://static.vecteezy.com/system/resources/thumbnails/008/440/451/small/farm-animal-livestock-circle-badge-logo-free-vector.jpg' />
                            </section>
                            <section className=' '>
                                <h1 className='mt-2 font-semibold text-3xl dark:text-white text-black'>Techical Shubham</h1>
                                <h1 className='line-clamp-4 text-sm text-gray-500 mt-1'>What do we mean by text?
                                    In the context of "texting," the word "text" refers to a written message sent electronically between two or more individuals using a device such as a smartphone, tablet, or computer. These messages can include written words, emojis, images, or other forms of digital communication.</h1>
                                <h1 className=' mt-1 dark:text-white text-black'> 100 subcribers</h1>
                                <button className='mt-1 bg-red-500 text-white text-sm px-5 py-[4px] rounded-full' onClick={() => document.getElementById('my_modal_3').showModal()}>Post New Video</button>
                            </section>
                        </section>

                        <section className=' mt-2'>
                            <h1 className=' dark:text-white text-black'>Videos</h1>
                            <div className=' border-t border-gray-500 mt-1'></div>
                            <div className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4'>
                                <VideoCard type={"your"} />
                                <VideoCard type={"your"} />
                                <VideoCard type={"your"} />
                                <VideoCard type={"your"} />
                            </div>
                        </section>
                    </div>
                </div>

                    <dialog id="my_modal_3" className="modal">
                        <div className="modal-box bg-white text-black  dark:bg-medium_black dark:text-white sm:max-w-[90vh] sm:max-h-[700vh] max-w-[90svh] max-h-[70svh]" >
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-md btn-circle btn-ghost text-lg absolute right-2 top-2">✕</button>
                            </form>
                            <h1 className=' text-lg font-semibold'>Add Video</h1>
                            <div className='overflow-y-auto p-2'>
                                <form onSubmit={handleAdd}>
                                    <label className=' text-sm'>Title:</label><br />
                                    <input value={title} onChange={(e) => {
                                        settitle(e.target.value)
                                    }} className=' px-3 py-[5px] rounded-lg bg-white dark:bg-light_black dark:border-none border w-[100%] focus:outline-none' type="text" id="title" name="title" /><br />

                                    <label className=' text-sm'>Description:</label><br />
                                    <textarea value={desc} onChange={(e) => {
                                        setdesc(e.target.value)
                                    }} className=' px-3 py-[5px] rounded-lg bg-white border dark:bg-light_black dark:border-none w-[100%] focus:outline-none' id="description" name="description" rows="4" cols="50"></textarea><br />

                                    <label className=' text-sm mt-2'>Thambnail Image</label><br />
                                    <div className="flex items-center justify-between w-full dark:bg-light_black dark:border-none bg-white border rounded-lg px-3 py-[5px] focus:outline-none">
                                        <label onClick={() => {
                                            imageRef.current.click();
                                        }} className="cursor-pointer flex items-center  gap-3 text-sm"><MdCloudUpload size={28} color='gray' />Choose Thambnail File</label>
                                    </div>
                                    <h1 className=' text-xs mt-1 text-gray-600'>{thumbnailName}</h1>

                                    <label className=' text-sm mt-2'>video</label><br />
                                    <div className="flex items-center justify-between w-full dark:bg-light_black dark:border-none bg-white border rounded-lg px-3 py-[5px] focus:outline-none">
                                        <label onClick={() => {
                                            videoRef.current.click();
                                        }} className="cursor-pointer flex items-center  gap-3 text-sm"><MdCloudUpload size={28} color='gray' />Choose Video File</label>
                                    </div>
                                    <h1 className=' text-sm mt-1 text-gray-600'>{videoFileName}</h1>

                                    <label className=' text-sm mt-2'>Topics:</label><br />
                                    <Multiselect
                                        style={{ borderWidth: '0px' }}
                                        selectedValues={selectedTopics}
                                        options={category}
                                        displayValue="name"
                                        onSelect={handleTopicSelect}
                                        onRemove={handleTopicSelect}
                                    /><br />

                                    <button type='submit' className=' bg-red-500 rounded-lg cursor-pointer  text-white px-4 py-[4px]'>Submit</button>
                                </form>
                                <input ref={imageRef} type="file" id="thumbnail" name="thumbnail" className="hidden absolute inset-0 " accept="image/*" onChange={handleThambnailchange} />
                                <input ref={videoRef} type="file" id="thumbnail" name="thumbnail" className="hidden absolute inset-0 " accept="video/*" onChange={handleVideochange} />
                            </div>
                        </div>
                    </dialog> </div>
                    :
                    <div className=' flex flex-col justify-center items-center h-full w-full gap-2'>
                        <section className=' bg-white dark:bg-medium_black border dark:border-none p-3 sm:p-10 rounded-lg text-center'>
                            <img src={createChannel} className=' w-80 h-80' />
                            <h1 className=' font-semibold text-xl dark:text-white text-black'>You don't have a Channel</h1>
                            <p className=' text-sm text-gray-500 '>Create one and post your videos</p>
                            <button className=' bg-red-500 text-white px-4 py-[5px] rounded-lg my-2' onClick={() => {
                                if (token) {
                                    document.getElementById('my_modal_4').showModal()
                                } else {
                                    toast.error("login first to create channel..")
                                }
                            }}>Create Channel</button>
                        </section>

                        <dialog id="my_modal_4" className="modal">
                            <div className="modal-box bg-white text-black  dark:bg-medium_black dark:text-white sm:max-w-[90vh] sm:max-h-[85vh] max-w-[90svh] max-h-[85svh]" >
                                <form method="dialog">
                                    {/* if there is a button in form, it will close the modal */}
                                    <button className="btn btn-md btn-circle btn-ghost text-lg absolute right-2 top-2">✕</button>
                                </form>
                                <h1 className=' text-lg font-semibold'>Create Channel</h1>
                                <div className='overflow-y-auto p-2'>
                                    <form onSubmit={handleCreateChannel}>
                                        <label className=' text-sm'>Title:</label><br />
                                        <input value={channelName} onChange={(e) => {
                                            setErrorToInitial()
                                            setchannelName(e.target.value)
                                        }} className=' px-3 py-[5px] rounded-lg bg-white dark:bg-light_black dark:border-none border w-[100%] focus:outline-none' type="text" id="title" name="title" />
                                        <h1 className={` ${errorCreate.name ? "" : "hidden"} text-xs text-red-500 m-[2px]`}>*name is required</h1>

                                        <label className=' text-sm'>Description:</label><br />
                                        <textarea value={channelDes} onChange={(e) => {
                                            setErrorToInitial()
                                            setchannelDes(e.target.value)
                                        }} className=' px-3 py-[5px] rounded-lg bg-white border dark:bg-light_black dark:border-none w-[100%] focus:outline-none' id="description" name="description" rows="4" cols="50"></textarea>
                                        <h1 className={` ${errorCreate.des ? "" : "hidden"} text-xs text-red-500 m-[2px]`}>*description is required</h1>

                                        <label className=' text-sm mt-2'>Profile Image</label><br />
                                        <div className="flex items-center justify-between w-full dark:bg-light_black dark:border-none bg-white border rounded-lg px-3 py-[5px] focus:outline-none">
                                            <label onClick={() => {
                                                profileRef.current.click();
                                            }} className="cursor-pointer flex items-center  gap-3 text-sm"><MdCloudUpload size={28} color='gray' />Choose profile image</label>
                                        </div>
                                        <h1 className=' text-xs mt-1 text-gray-600'>{profileName}</h1>
                                        <h1 className={` ${errorCreate.profile ? "" : "hidden"} text-xs text-red-500 m-[2px]`}>*profile is required</h1>

                                        <label className=' text-sm mt-2'>Banner of Channel</label><br />
                                        <div className="flex items-center justify-between w-full dark:bg-light_black dark:border-none bg-white border rounded-lg px-3 py-[5px] focus:outline-none">
                                            <label onClick={() => {
                                                bannerRef.current.click();
                                            }} className="cursor-pointer flex items-center  gap-3 text-sm"><MdCloudUpload size={28} color='gray' />Choose banner image</label>
                                        </div>
                                        <h1 className=' text-sm mt-1 text-gray-600'>{bnnaerName}</h1>
                                        <h1 className={` ${errorCreate.banner ? "" : "hidden"} text-xs text-red-500 m-[2px]`}>*banner image is required</h1>

                                        <label className=' text-sm mt-2'>Topics:</label><br />
                                        <Multiselect
                                            style={{ borderWidth: '0px' }}
                                            selectedValues={channelSelectedTopics}
                                            options={category}
                                            displayValue="name"
                                            onSelect={handleChannelTopicSelect}
                                            onRemove={handleChannelTopicSelect}
                                        />
                                        <h1 className={` ${errorCreate.topic ? "" : "hidden"} text-xs text-red-500 m-[2px]`}>*category is required</h1><br />

                                        <button type='submit' className=' bg-red-500 rounded-lg cursor-pointer text-white px-4 py-[4px]'>{channelLoader ? <BeatLoader size={10} color='white' /> : "Create"}</button>
                                    </form>
                                    <input ref={profileRef} type="file" id="thumbnail" name="thumbnail" className="hidden absolute inset-0 " accept="image/*" onChange={handleProfilechange} />
                                    <input ref={bannerRef} type="file" id="thumbnail" name="thumbnail" className="hidden absolute inset-0 " accept="image/*" onChange={handleBannerchange} />
                                </div>
                            </div>
                        </dialog>
                    </div>
            }


            {/* <label className='text-sm'>Video</label><br />
            <div className="flex items-center justify-between w-full dark:bg-light_black dark:border-none bg-white border rounded-lg px-3 py-[5px] focus:outline-none">
                <label onClick={() => {
                    videoRef.current.click();
                }} className="cursor-pointer flex items-center  gap-3 text-sm"><MdCloudUpload size={28} color=' red' />Choose File</label>
                <span id="selectedFile" className="ml-2"></span>
            </div><br /> */}


        </div>
    )
}

export default YourChannel