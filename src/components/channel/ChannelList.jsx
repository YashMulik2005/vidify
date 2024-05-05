import React, { useEffect, useState } from 'react'
import ChannelCard from './ChannelCard'
import axios from 'axios'
import ChannelCardSkeleton from '../loaders/ChannelCardSkeleton'
import noData from '../../assets/noData.png';
import { MdHistory } from "react-icons/md";
import InfiniteScroll from 'react-infinite-scroll-component';

function ChannelList() {
    const [data, setdata] = useState()
    const [loader, setloader] = useState(false)
    const [search, setsearch] = useState(null)
    const [searchSuggest, setsearchSuggest] = useState([])
    const [currentPage, setcurrentPage] = useState(0)
    const [moreData, setmoreData] = useState(false)

    const featchdata = async () => {
        setloader(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/channel/getChennls`);
        setcurrentPage(res.data.response.currentPage);
        setmoreData(res.data.response.moreData)
        setdata(res.data.response.data)
        setloader(false)
    }

    const fetchMore = async () => {
        let url = `${import.meta.env.VITE_BACKEND_URL}/channel/getChennls?page=${currentPage + 1}`

        const res = await axios.get(url)
        setcurrentPage(res.data.response.currentPage);
        setmoreData(res.data.response.moreData)
        setdata(prev => [...prev, ...res.data.response.data])
    }

    const handlesearch = async () => {
        setsearchSuggest([]);
        setloader(true)
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/channel/search?page=1`, {
            search: search == null ? "" : search
        })
        setdata(res.data.response.data);
        setloader(false)
    }

    const handleSuggest = async () => {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/channel/suggestSearch`, {
            search: search
        })
        setsearchSuggest(res.data.response);
    }

    useEffect(() => {
        featchdata()
    }, [])

    useEffect(() => {
        handleSuggest()
    }, [search])

    useEffect(() => {
        if (search === "") {
            handlesearch();
        }
    }, [search == ""])

    return (
        <div className=' p-2 flex flex-col gap-4 overflow-y-auto' id="scrollContainer">
            <h1 className=' dark:text-white text-black '>Top Channels</h1>
            <section className='relative '>
                <form className=' w-[100%] flex justify-center ' onSubmit={(e) => {
                    e.preventDefault();
                    handlesearch()
                }}>
                    <input onChange={(e) => setsearch(e.target.value)} value={search} className=' dark:bg-medium_black rounded-full text-sm px-5 py-[7px] w-[90%] bg-white text-black dark:text-text dark:border-none border focus:outline-none' placeholder='search' />
                </form>
                <section className={`z-30 w-[100%] flex justify-center items-center max-h-80 overflow-y-auto absolute mt-1 ${search === "" || searchSuggest?.length === 0 ? "hidden" : ""}`}>
                    <div className='dark:bg-light_black w-[90%] max-h-80
                     p-3 text-sm rounded-lg overflow-y-auto'>
                        {
                            searchSuggest?.map((item, index) => (
                                <h1 key={index} className=' line-clamp-1 my-[8px] text-black dark:text-white flex items-center gap-3'><MdHistory size={20} />{item.name}</h1>
                            ))
                        }
                    </div>
                </section>
            </section>
            <div className=' '>
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
                    ) :
                        < InfiniteScroll
                            dataLength={data?.length ? data.length : 0}
                            next={fetchMore}
                            hasMore={moreData}
                            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 gap-3'
                            loader={
                                <>
                                    <ChannelCardSkeleton />
                                    <ChannelCardSkeleton />
                                    <ChannelCardSkeleton />
                                    <ChannelCardSkeleton />
                                </>
                            }
                            scrollableTarget="scrollContainer"
                        >
                            {
                                data?.map((item, index) => (
                                    <ChannelCard data={item} key={index} />
                                ))}
                        </InfiniteScroll>
                )
                }
            </div>
        </div>
    )
}

export default ChannelList