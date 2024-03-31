import React, { useEffect, useState } from 'react'
import VideoCard from '../videos/VideoCard'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import noData from '../../assets/noData.png'

function ChannelIndex() {
    const { id } = useParams();
    console.log(id);
    const [data, setdata] = useState()

    const fatchdata = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/channel/oneChannel/${id}`)
        //console.log(res.data.data);
        setdata(res.data.data)
    }

    useEffect(() => {
        fatchdata()
    }, [])

    return (
        <div className=' px-5 py-2 overflow-y-auto'>
            <div>
                <section className=' hidden sm:block'>
                    <img className=' w-[100%] h-44 rounded-3xl pt-2 object-fill'
                        src={data?.banner_image} />
                </section>

                <section className=' grid grid-col-1 sm:grid-cols-[180px_auto] items-center my-4 mx-2'>
                    <section className=' flex sm:block justify-center'>
                        <img className=' w-40 h-40  object-cover rounded-full'
                            src={data?.profile_image} />
                    </section>
                    <section className=' '>
                        <h1 className='mt-2 font-semibold text-3xl dark:text-white text-black'>{data?.name}</h1>
                        <h1 className='line-clamp-4 text-sm text-gray-500 mt-1'>{data?.description}</h1>
                        <h1 className=' mt-1 dark:text-white text-black'> {data?.subscribers.length} subscribers</h1>
                        <button className='mt-1 bg-white text-black px-5 py-[4px] rounded-full'>subcribed</button>
                    </section>
                </section>

                <section className=' mt-2'>
                    <h1 className=' dark:text-white text-black'>Videos</h1>
                    <div className=' border-t border-gray-500 mt-1'></div>
                    <div className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2'>
                        {data?.videos?.length === 0 ? (
                            <div className='w-[90vw] flex justify-center items-center flex-col mt-[-15px]'>
                                <img src={noData} className='w-40 h-40' alt="No data" />
                                <h1 className='dark:text-white text-black'>No video Found</h1>
                            </div>
                        ) : (
                            data?.videos?.map((item, index) => (
                                <VideoCard type="all" key={index} data={item} />
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ChannelIndex