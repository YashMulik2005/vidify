import React, { useEffect, useState } from 'react'
import ChannelCard from './ChannelCard'
import axios from 'axios'
import ChannelCardSkeleton from '../loaders/ChannelCardSkeleton'
import noData from '../../assets/noData.png';

function ChannelList() {
    const [data, setdata] = useState()
    const [loader, setloader] = useState(false)
    const [search, setsearch] = useState()
    const [searchSuggest, setsearchSuggest] = useState()

    const featchdata = async () => {
        setloader(true)
        const res = await axios.get("http://localhost:3000/api/channel/getChennls");
        setdata(res.data.data)
        setloader(false)
    }

    const handleSuggest = async (e) => {
        setsearch(e.target.value);

        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/channel/suggestSearch`, {
            search: search
        })
        console.log(res);
        setsearchSuggest(res.data.response);
    }

    const handleSearch = (e) => {
        e.preventDefault();
    }
    useEffect(() => {
        featchdata()
    }, [])

    return (
        <div className=' p-2 flex flex-col gap-4 overflow-y-auto'>
            <h1 className=' dark:text-white text-black '>Top Channels</h1>
            <section className='relative '>
                <form className=' w-[100%] flex justify-center ' onSubmit={handleSearch}>
                    <input onChange={handleSuggest} value={search} className=' dark:bg-medium_black rounded-full text-sm px-5 py-[7px] w-[90%] bg-white text-black dark:text-text dark:border-none border focus:outline-none' placeholder='search' />
                </form>
                <section className=' w-[100%] absolute flex justify-center items-center max-h-16 overflow-y-auto mt-1  text-sm'>
                    <div className=' w-[90%] bg-black rounded-lg p-2 px-5 max-h-16 overflow-y-auto'>
                        {
                            searchSuggest?.map((item) => {
                                return <h1 key={item._id}>{item.name}</h1>
                            })
                        }
                    </div>
                </section>
            </section>
            <div className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
                {loader ? (
                    <>
                        <ChannelCardSkeleton />
                        <ChannelCardSkeleton />
                        <ChannelCardSkeleton />
                        <ChannelCardSkeleton />
                    </>
                ) : (
                    data?.length === 0 ? (
                        <div className='w-90vw h-90vh flex justify-center items-center flex-col mt-[-15px]'>
                            <img src={noData} className='w-40 h-40' alt="No data" />
                            <h1 className='dark:text-white text-black'>No video Found</h1>
                        </div>
                    ) : (
                        data?.map((item, index) => (
                            <ChannelCard data={item} key={index} />
                        ))
                    )
                )
                }
            </div>
        </div>
    )
}

export default ChannelList