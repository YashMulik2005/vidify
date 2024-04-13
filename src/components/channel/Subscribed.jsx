import React, { useEffect, useState } from 'react'
import SubcribedCard from './SubcribedCard'
import AuthHook from '../Context/AuthContext';
import useMain from '../Context/MainContext';
import axios from 'axios';
import VideoCard from '../videos/VideoCard';
import VideoCardSkeleton from '../loaders/VideoCardSkeleton';
import noData from '../../assets/noData.png';
import SubcribedCardSkeleton from '../loaders/SubcribedCardSkeleton';

function Subscribed() {
    const { selectChannel } = useMain()
    const { userDetails, token } = AuthHook();
    const [videoData, setvideoData] = useState()
    const [loader, setloader] = useState(false)

    const getAllVidoes = async () => {
        setloader(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/feed/subscribedData`, {
            headers: {
                "authentication": `bearer ${token}`
            }
        })
        setvideoData(res.data.data)
        setloader(false)
    }

    const getSelectedVideo = async () => {
        setloader(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/video/channel/${selectChannel}`, {
            headers: {
                "authentication": `bearer ${token}`
            }
        })
        setvideoData(res.data.data)
        setloader(false)
    }

    useEffect(() => {
        if (selectChannel == "all") {
            getAllVidoes()
        } else {
            getSelectedVideo()
        }
        console.log(videoData);
    }, [selectChannel])

    return (
        <div className=' w-[100%] overflow-x-auto'>
            <div className='w-[100%] flex items-center gap-4 px-4 py-[6px] overflow-x-auto'>
                {
                    userDetails?.subscribed?.map((item) => {
                        return <SubcribedCard key={item} data={item} />
                    })
                }
            </div>
            <div className='border-b  dark:border-[#353333]'></div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 gap-3'>
                {
                    loader ? <div>
                        <VideoCardSkeleton />
                        <VideoCardSkeleton />
                        <VideoCardSkeleton />
                        <VideoCardSkeleton />
                        <VideoCardSkeleton />
                        <VideoCardSkeleton />
                        <VideoCardSkeleton />
                        <VideoCardSkeleton />
                    </div> :
                        videoData?.length == 0 ? <div className='w-[90vw] flex justify-center items-center flex-col mt-[-15px]'>
                            <img src={noData} className='w-40 h-40' alt="No data" />
                            <h1 className='dark:text-white text-black'>No video Found</h1>
                        </div> :
                            videoData?.map((item) => {
                                return <VideoCard key={item._id} data={item?._id} type="all" />
                            })
                }
            </div>

        </div>
    )
}

export default Subscribed