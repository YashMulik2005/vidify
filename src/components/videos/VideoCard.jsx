import React, { useEffect, useRef, useState } from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { MdCloudUpload } from "react-icons/md";
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';

function VideoCard({ type }) {
    const [videoOption, setvideoOption] = useState(false);
    const [category, setcategory] = useState([])
    const [thumbnailName, setThumbnailName] = useState("");
    const [thambnail, setthambnail] = useState();
    const [selectedTopics, setselectedTopics] = useState([])
    const [selectedTopicIds, setselectedTopicIds] = useState([]);
    const [title, settitle] = useState("")
    const [desc, setdesc] = useState("")
    const imageRef = useRef(null);

    const handleedit = (e) => {
        e.preventDefault();
        const formdata = {
            title: title,
            description: desc,
            thambnail: thambnail,
            topic: selectedTopicIds
        }
        console.log(formdata);
    }

    const hadledelete = (e) => {
        e.preventDefault()
        document.getElementById('my_modal_2').close();
    }
    const getCategory = async () => {
        const res = await axios.get("http://localhost:3000/api/category/getCategory")
        setcategory(res.data.data.category)
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

    useEffect(() => {
        if (type == "your") {
            getCategory()
        }
    }, [])


    return (
        <div className=' h-full w-full'>
            <div className=' rounded-lg p-1 relative'>
                <section className={` ${type == "your" ? "" : "hidden"} absolute right-4 top-3 text-black  bg-white p-[6px] rounded-full `}>
                    {
                        <BsThreeDotsVertical size={15} className=' cursor-pointer' onClick={() => { setvideoOption(true) }} />
                    }
                </section>
                <section className={` ${videoOption ? "" : "hidden"} text-sm absolute right-4 top-3 text-black bg-white px-4 py-2 rounded-lg`} >
                    <h1 className=' cursor-pointer flex justify-end mx-[-2px]'><RxCross2 size={18} onClick={() => { setvideoOption(false) }} /></h1>
                    <h1 className=' cursor-pointer' onClick={() => document.getElementById('my_modal_1').showModal()}>Edit</h1>
                    <h1 className=' cursor-pointer' onClick={() => document.getElementById('my_modal_2').showModal()}>Delete</h1>
                </section>
                <div>
                    <img className=' rounded-lg h-40 w-full'
                        src='https://img.freepik.com/free-photo/sports-car-driving-asphalt-road-night-generative-ai_188544-8052.jpg' />
                </div>
                <div className=' grid grid-cols-[45px_auto] mt-2 items-center gap-1'>
                    <img className=' rounded-full  w-8 h-8'
                        src='https://static.vecteezy.com/system/resources/thumbnails/008/440/451/small/farm-animal-livestock-circle-badge-logo-free-vector.jpg' />
                    <section >
                        <p className=' text-sm dark:text-white text-black'>bhjgsuyc jhvuyscdt jhvdycdyte hvdg</p>
                        <p className=' text-sm text-gray-400'>channel name</p>
                        <section className=' mt-1 text-gray-500 flex text-xs justify-between items-center w-[full]'>
                            <p className=''>500 views</p>
                            <p>1 day ago</p>
                        </section>
                    </section>
                </div>


                {/* update model */}
                <dialog id="my_modal_1" className="modal">
                    <div className="modal-box bg-white text-black  dark:bg-medium_black dark:text-white sm:max-w-[90vh] sm:max-h-[700vh] max-w-[90svh] max-h-[70svh]" >
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h1 className=' text-lg'>Edit Video Information</h1>
                        <div className='overflow-y-auto p-2'>
                            <form onSubmit={handleedit}>
                                <label className=' text-sm'>Title:</label><br />
                                <input value={title} onChange={(e) => {
                                    settitle(e.target.value)
                                }} className=' px-3 py-[5px] rounded-lg bg-white dark:bg-light_black dark:border-none border w-[100%] focus:outline-none' type="text" id="title" name="title" /><br />

                                <label className=' text-sm'>Description:</label><br />
                                <textarea value={desc} onChange={(e) => {
                                    setdesc(e.target.value)
                                }} className=' px-3 py-[5px] rounded-lg bg-white border dark:bg-light_black dark:border-none w-[100%] focus:outline-none' id="description" name="description" rows="4" cols="50"></textarea><br />

                                <label className=' text-sm'>Thambnail Image</label><br />
                                <div className="flex items-center justify-between w-full dark:bg-light_black dark:border-none bg-white border rounded-lg px-3 py-[5px] focus:outline-none">
                                    <label onClick={() => {
                                        imageRef.current.click();
                                    }} className="cursor-pointer flex items-center  gap-3 text-sm"><MdCloudUpload size={28} color=' gray' />Choose File</label>
                                </div>
                                <h1 className=' text-xs mt-1 text-gray-600'>{thumbnailName}</h1>
                                <br />

                                <label className=' text-sm'>Topics:</label><br />
                                <Multiselect
                                    style={{ borderWidth: '0px' }}
                                    selectedValues={selectedTopics}
                                    options={category}
                                    displayValue="name"
                                    onSelect={handleTopicSelect}
                                    onRemove={handleTopicSelect}
                                />
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
            </div>
        </div>


    )
}

export default VideoCard