import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AuthHook from '../Context/AuthContext';
import noData from '../../assets/noData.png';
import VideoCardSkeleton from '../loaders/VideoCardSkeleton';
import VideoCard from '../videos/VideoCard';
import InfiniteScroll from 'react-infinite-scroll-component';


function WatchHistroy() {
    const [data, setdata] = useState()
    const [loader, setloader] = useState(false)
    const [currrentPage, setcurrrentPage] = useState(1);
    const [moreData, setmoreData] = useState();

    const { token } = AuthHook()

    const fetchData = async () => {
        try {
            setloader(true)
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/watchHistory?limit=8`, {
                headers: {
                    "authentication": `bearer ${token}`
                }
            });

            setcurrrentPage(res.data.response.currentPage);
            setmoreData(res.data.response.moreData);
            setdata(res.data.response.data);
            setloader(false)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const fetchMore = async () => {
        console.log("bhhuvb");
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/watchHistory?limit=8&page=${currrentPage + 1}`, {
                headers: {
                    "authentication": `bearer ${token}`
                }
            });

            setcurrrentPage(res.data.response.currentPage);
            setmoreData(res.data.response.moreData);
            setdata(prev => [...prev, ...res.data.response.data]);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <div className=' p-3 overflow-y-auto' id='scrollContainer'>
            <h1 className=' text-black dark:text-white'>Your Watch History</h1>
            {loader && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 mt-3">
                    <VideoCardSkeleton />
                    <VideoCardSkeleton />
                    <VideoCardSkeleton />
                    <VideoCardSkeleton />
                    <VideoCardSkeleton />
                    <VideoCardSkeleton />
                    <VideoCardSkeleton />
                    <VideoCardSkeleton />
                </div>
            )}
            {!loader && data?.length === 0 && (
                <div className='w-[90vw] flex justify-center items-center flex-col mt-[-15px]'>
                    <img src={noData} className='w-55 h-55' alt="No data" />
                    <h1 className='dark:text-white text-black'>No video Found</h1>
                </div>
            )}
            {!loader && data?.length > 0 && (
                <InfiniteScroll
                    dataLength={data?.length ? data.length : 0}
                    next={fetchMore}
                    hasMore={moreData}
                    className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-2 sm:p-4 gap-3'
                    loader={
                        <>
                            <VideoCardSkeleton />
                            <VideoCardSkeleton />
                            <VideoCardSkeleton />
                            <VideoCardSkeleton />
                        </>
                    }
                    scrollableTarget="scrollContainer"
                >
                    {data?.map((item, index) => (
                        <div key={index} className="relative z-10">
                            <VideoCard type="add" data={item.video} />
                        </div>
                    ))}
                </InfiniteScroll>
            )
            }
        </div>
    )
}

export default WatchHistroy