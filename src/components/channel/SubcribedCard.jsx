import React, { useEffect, useState } from 'react'
import axios from 'axios';
import useMain from '../Context/MainContext';
import SubcribedCardSkeleton from '../loaders/SubcribedCardSkeleton';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function SubcribedCard({ data }) {
    const [channelData, setchannelData] = useState()
    const { selectChannel, setselectChannel } = useMain()
    const [loader, setloader] = useState(false)

    const getdata = async () => {
        setloader(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/channel/oneChannel/${data}`)
        setchannelData(res.data.data)
        setloader(false)
    }
    useEffect(() => {
        getdata()
    }, [])

    return (
        <div>
            {
                loader ? <SubcribedCardSkeleton /> : <section className=' flex flex-col items-center cursor-pointer' onClick={() => {
                    setselectChannel(channelData?._id)
                }}>
                    <LazyLoadImage src={channelData?.profile_image} className='rounded-full w-12 h-12' />
                    <h1 className={`text-xs dark:text-gray-500 text-black ${selectChannel == channelData?._id ? "dark:text-white text-black" : "text-gray-500"}`}>{channelData?.name.length > 8 ? channelData?.name.substring(0, 8) + "..." : channelData?.name.substring(0, 8)} </h1>
                </section>
            }
        </div>
    )
}

export default SubcribedCard