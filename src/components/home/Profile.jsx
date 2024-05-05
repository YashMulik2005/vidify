import React, { useEffect, useRef, useState } from 'react'
import logo from "../../assets/user_default.png"
import axios from 'axios'
import AuthHook from '../Context/AuthContext'
import VideoCard from '../videos/VideoCard';
import { useNavigate } from 'react-router-dom';
import ProfileSkeleton from '../loaders/ProfileSkeleton';
import noData from '../../assets/noData.png';
import { MdOutlineEdit } from "react-icons/md";
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners'
import { IoIosCamera } from "react-icons/io";
import { HashLoader } from 'react-spinners'

function Profile() {
    const { token } = AuthHook();
    const Navigate = useNavigate();
    const [userData, setuserData] = useState()
    const [watchHisstory, setwatchHisstory] = useState()
    const [loading, setloading] = useState(false)
    const [category, setcategory] = useState();
    const [selectedTopic, setselectedTopic] = useState()
    const [categoryLoader, setcategoryLoader] = useState()
    const [profile, setProfile] = useState()
    const [previewUrl, setPreviewUrl] = useState(null);
    const profileRef = useRef(null);
    const [upadateloader, setupadateloader] = useState(false);
    const [search, setsearch] = useState(null);
    const [topicLoader, settopicLoader] = useState(false)

    const getUserData = async () => {
        setloading(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, {
            headers: {
                "authentication": `bearer ${token}`
            }
        });
        setuserData(res.data.data);
        setselectedTopic(res.data.data.interested_area.map(topic => topic._id))
    }

    const select_area = (item) => {
        const index = selectedTopic.indexOf(item._id);
        if (index != -1) {
            const new_arr = [...selectedTopic];
            new_arr.splice(index, 1);
            setselectedTopic(new_arr);
        } else {
            setselectedTopic([...selectedTopic, item._id])
        }
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

    const handleTopicEdit = async () => {
        setcategoryLoader(true)
        const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/auth/updateInterstedArea`, {
            category: selectedTopic
        }, {
            headers: {
                authentication: `bearer ${token}`
            }
        })
        if (res.data.status) {
            document.getElementById('topicEditMOdal').close();
            toast.success("Updated Sucessfully..")
            window.location.reload();
        }
        setcategoryLoader(false)
    }

    const getCategory = async () => {
        settopicLoader(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/category/getCategory?search${search !== null && search !== "" ? "=" + search : "="}`)
        setcategory(res.data.data.category)
        settopicLoader(false)
    }

    const handleProfileChange = (e) => {
        const selectedFile = e.target.files[0]
        setProfile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
        document.getElementById('previewModal').showModal()
    };

    const updateProfile = async () => {
        try {
            setupadateloader(true);
            const profilelData = new FormData();
            profilelData.append("file", profile);
            profilelData.append("upload_preset", "vidify_image_preset");
            const profileRes = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, profilelData);
            const profileUrl = profileRes.data.secure_url;
            console.log(profileUrl);

            const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/auth/updateProfile`, {
                profile: profileUrl
            }, {
                headers: {
                    authentication: `bearer ${token}`
                }
            })
            if (res.status) {
                toast.success("profile photo updated sucessfully..")
                document.getElementById('previewModal').close()
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
            toast.error("somthing went wrong try again..")
        }
        setupadateloader(false);
    }


    useEffect(() => {
        getUserData();
        getHistory();
    }, [])

    useEffect(() => {
        getCategory()
    }, [search])


    return (
        <div className=' px-2 sm:px-5 py-1 overflow-y-auto'>
            {
                loading ? <ProfileSkeleton /> :
                    <section>
                        <section className=' flex justify-between sm:pr-10 py-3'>
                            <div className=' flex gap-3 items-center sm:w-[60%]'>
                                <section className=' relative '>
                                    <img src={userData?.profile_image ? userData.profile_image : logo} className=' w-28 h-28 rounded-full' />
                                    <section onClick={() => {
                                        profileRef.current.click()
                                    }} className='absolute bottom-2 cursor-pointer right-2 dark:bg-black bg-bg_white rounded-full p-1'><IoIosCamera color='dark:white black' size={20} /></section>
                                    <input ref={profileRef} type="file" id="profile" name="profile" className="hidden absolute inset-0" accept="image/*" onChange={handleProfileChange} />
                                </section>
                                <section>
                                    <h1 className=' font-semibold text-xl dark:text-white text-black'>{userData?.username}</h1>
                                    <h1 className='text-gray-600'>{userData?.fname + " " + userData?.lname}</h1>
                                    <p className='text-gray-600'>{userData?.email}</p>
                                    <button onClick={() => {
                                        document.getElementById('logoutModel').showModal()
                                    }} className={`bg-gradient-to-tr my-2 via-[#FF0000] from-[#FF0000] to-[#c10505] text-white px-5 text-xs  py-[4px] rounded-3xl font-semibold dark:hover:bg-light_black hover:bg-black`}>Logout</button>
                                </section>
                            </div>
                            {userData?.channel &&
                                <div className='hidden sm:block my-[8px] p-2 rounded-lg'>
                                    <p className=' dark:text-white text-black text-sm'>Channel Details</p>
                                    <section className=' flex flex-row-reverse items-center gap-3'>
                                        <img src={userData?.channel?.profile_image} className=' w-16 h-16 rounded-full' />
                                        <section>
                                            <h2 className='dark:text-white text-black font-semibold'>{userData?.channel?.name}</h2>
                                            <p className='dark:text-gray-500 text-gray-600 text-sm'>{userData?.channel?.subscribers?.length} {userData?.channel?.subscribers?.length > 1 || userData?.channel?.subscribers?.length == 0 ? "subscribers" : "subscriber"}</p>
                                            <button onClick={() => {
                                                Navigate(`/channel/${userData?.channel?._id}`)
                                            }} className={`bg-gradient-to-tr my-1 via-[#FF0000] from-[#FF0000] to-[#c10505] text-white px-5 text-xs  py-[4px] rounded-3xl  dark:hover:bg-light_black hover:bg-black`}>View Channel</button>
                                        </section>
                                    </section>
                                </div>}
                        </section>
                        <div className=' border border-gray-500 '></div>
                        <section className=' py-3'>
                            <setcion className="flex justify-between px-3 py-1 dark:text-white text-black">
                                <h1 className=' text-sm sm:text-md'>Watch History</h1>
                                {watchHisstory?.length !== 0 &&
                                    <h1 className=' cursor-pointer' onClick={() => Navigate("/watchHistroy")}>See All views</h1>
                                }
                            </setcion>
                            <div className=' grid grid-cols-1 sm:grid-cols-4 overflow-x-auto'>
                                {
                                    watchHisstory?.length == 0 ? <div className='w-[90vw] flex justify-center items-center flex-col mt-[-15px]'>
                                        <img src={noData} className=' w-36 h-36' alt="No data" />
                                        <h1 className='dark:text-white text-black text-xs'>No video Found</h1>
                                    </div> :
                                        watchHisstory?.map((item, index) => {
                                            return <VideoCard type="add" data={item.video} key={index} />
                                        })
                                }
                                {/* <div>SEE MORE</div> */}
                            </div>
                        </section>
                        <div className=' border border-gray-500 '></div>
                        <section className=' py-2'>
                            <setcion className="flex justify-between px-3 py-2 sm:py-1 dark:text-white text-black">
                                <h1>Interested Area</h1>
                                <h1 onClick={() => {
                                    document.getElementById('topicEditMOdal').showModal();
                                }} className=' cursor-pointer text-sm flex items-center gap-1'>Edit <MdOutlineEdit /></h1>
                            </setcion>
                            <div className=' flex flex-wrap gap-2 text-sm justify-center items-center p-2'>
                                {userData?.interested_area?.map((item, index) => {
                                    return <section key={index} className={`bg-red-50 text-gray-500 dark:text-gray-700 px-3 py-[5px] border dark:border-none rounded-full cursor-pointer `}>{item.name}</section>
                                })}
                            </div>
                        </section>
                    </section>
            }

            <dialog id="topicEditMOdal" className="modal">
                <div className="modal-box bg-white text-black dark:bg-medium_black dark:text-white sm:max-w-[90vh] sm:max-h-[85vh] max-w-[90svh] max-h-[85svh]">
                    <form method="dialog">
                        <button className="btn btn-md btn-circle btn-ghost text-lg absolute right-2 top-2">✕</button>
                    </form>
                    <h1 className=''>Edit Interested Area</h1>
                    <div className=' w-[100%] flex justify-center items-center gap-1'>
                        <input type='text' value={search} onChange={(e) => {
                            setsearch(e.target.value)
                        }
                        } placeholder='search' className='border text-sm dark:bg-light_black bg-bg_white text-black dark:text-white rounded-3xl px-3 py-[5px] dark:border-none w-[100%] my-2 focus:outline-none' />
                    </div>
                    {categoryLoader ? <div className=' h-[60vh] flex justify-center items-center flex-col gap-2'> <BeatLoader color=' red' />updating</div> :
                        <div className='overflow-y-auto p-2'>
                            <form className='flex flex-wrap gap-2 justify-center items-center h-[60vh] max-h-[60vh] overflow-y-scroll p-2'>
                                {
                                    topicLoader ? <HashLoader color='red' /> :
                                        category?.length == 0 ? <div className='flex justify-center items-center flex-col'>
                                            <img src={noData} className=' w-40 h-40' alt="No data" />
                                            <h1 className='dark:text-white text-black'>No video Found</h1>
                                        </div> :
                                            category?.map((item) => {
                                                return <section onClick={() => select_area(item)} key={item._id} className={`${selectedTopic?.includes(item._id) ? "bg-red-600 text-white" : " bg-red-100 dark:bg-red-300"} cursor-pointer px-3 text-sm rounded-xl py-[3px]`}>{item.name}</section>
                                            })
                                }
                            </form>
                            <button onClick={handleTopicEdit} type='submit' className='bg-red-500 rounded-lg cursor-pointer text-white px-4 py-[4px] text-sm'>Edit</button>
                        </div>
                    }
                </div>
            </dialog>

            <dialog id="previewModal" className="modal">
                <div className="modal-box bg-white text-black dark:bg-medium_black dark:text-white sm:max-w-[50vh] sm:max-h-[85vh] max-w-[80svh] max-h-[85svh]">
                    {
                        upadateloader ? <div className=' h-[35vh] flex justify-center items-center flex-col gap-2'><BeatLoader color='red' /></div> :
                            <div>
                                <h1 className=' mb-1'>Image Preview</h1>
                                <div>
                                    {previewUrl && <img src={previewUrl} className=' w-28 h-28 rounded-full m-auto border ' alt="Preview" />}
                                </div>
                                <div className=' flex justify-end gap-2 mt-3'>
                                    <button onClick={updateProfile} className='hover:bg-red-700 dark:hover:bg-red-700 dark:hover:text-white text-xs hover:text-white px-3 py-[4px] rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white'>Set Image</button>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        setProfile(null);
                                        setPreviewUrl(null);
                                        profileRef.current.value = "";
                                        document.getElementById('previewModal').close()
                                    }
                                    } className='dark:hover:bg-red-700 text-xs dark:hover:text-white hover:bg-red-700 hover:text-white px-3 py-[4px] rounded-lg dark:bg-gray-800 bg-gray-200 text-black dark:text-white'>Cancel</button>
                                </div>
                            </div>
                    }

                </div>
            </dialog>
        </div>
    )
}

export default Profile