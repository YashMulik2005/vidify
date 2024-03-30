import React, { useEffect, useState } from 'react'
import useMain from '../Context/MainContext'
import AuthHook from '../Context/AuthContext'
import axios from 'axios'
import Topics from './Topics';
import VideoCard from '../videos/VideoCard'
import noData from '../../assets/noData.png';

function Home() {
    const [data, setdata] = useState()

    const getdata = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/video/getvideos`)
        setdata(res.data.data)
    }

    useEffect(() => {
        getdata()
    }, [])

    return (
        <div className=' overflow-x-auto'>
            <Topics />
            <div className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 p-2'>
                {data?.length === 0 ? (
                    <div className='w-[90vw] flex justify-center items-center flex-col mt-[-15px]'>
                        <img src={noData} className='w-40 h-40' alt="No data" />
                        <h1 className='dark:text-white text-black'>No video Found</h1>
                    </div>
                ) : (
                    data?.map((item, index) => (
                        <VideoCard type="add" key={index} data={item._id} />
                    ))
                )}
            </div>
        </div>
    )
}

export default Home