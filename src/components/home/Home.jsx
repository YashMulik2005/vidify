import React, { useEffect, useState } from 'react';
import AuthHook from '../Context/AuthContext';
import axios from 'axios';
import Topics from './Topics';
import VideoCard from '../videos/VideoCard';
import noData from '../../assets/noData.png';
import VideoCardSkeleton from '../loaders/VideoCardSkeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import useMain from '../Context/MainContext';

function Home() {
    const { userDetails, token, islogedIn } = AuthHook();
    const { selectedTpic, setdata, data, setloading, loading, search } = useMain();
    const [currrentPage, setcurrrentPage] = useState(1);
    const [moreData, setmoreData] = useState();

    const fetchData = async () => {
        try {
            setloading(true)
            let url;
            if (search != null && search != "") {
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/video/search?page=${1}`, {
                    search: search
                })

                setcurrrentPage(res.data.response.currentPage);
                setmoreData(res.data.response.moreData);
                setdata(prev => [...prev, ...res.data.response.data]);
            } else {
                if (islogedIn && selectedTpic == "all") {
                    url = `${import.meta.env.VITE_BACKEND_URL}/feed/feeddata`;
                } else {
                    url = `${import.meta.env.VITE_BACKEND_URL}/video/getvideos?topic=${selectedTpic}`;
                }

                const res = await axios.get(url, {
                    headers: {
                        "authentication": token ? `bearer ${token}` : {}
                    }
                });

                setcurrrentPage(res.data.response.currentPage);
                setmoreData(res.data.response.moreData);
                setdata(res.data.response.data);
                setloading(false)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [selectedTpic]);

    const fetchMore = async () => {
        try {
            let url;
            if (search != null && search != "") {
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/video/search?page=${currrentPage + 1}`, {
                    search: search
                })

                setcurrrentPage(res.data.response.currentPage);
                setmoreData(res.data.response.moreData);
                setdata(prev => [...prev, ...res.data.response.data]);
            }
            else {
                if (islogedIn && selectedTpic == "all") {
                    url = `${import.meta.env.VITE_BACKEND_URL}/feed/feeddata?page=${currrentPage + 1}`;
                } else {
                    url = `${import.meta.env.VITE_BACKEND_URL}/video/getvideos?page=${currrentPage + 1}&topic=${selectedTpic}`;
                }

                const res = await axios.get(url, {
                    headers: {
                        "authentication": token ? `bearer ${token}` : {}
                    }
                });
                setcurrrentPage(res.data.response.currentPage);
                setmoreData(res.data.response.moreData);
                setdata(prev => [...prev, ...res.data.response.data]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }


    return (
        <div className='overflow-x-auto relative' id='scrollContainer'>
            <Topics />
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 mt-3 p-2">
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
            {!loading && data?.length === 0 && (
                <div className='w-[90vw] h-[90vh] flex justify-center items-center flex-col mt-[-15px]'>
                    <img src={noData} className=' w-40 h-40' alt="No data" />
                    <h1 className='dark:text-white text-black'>No video Found</h1>
                </div>
            )}
            {!loading && data.length > 0 && (
                <InfiniteScroll
                    dataLength={data?.length ? data.length : 0}
                    next={fetchMore}
                    hasMore={moreData}
                    className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 gap-3'
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
                        <div key={item._id} className="relative z-10">
                            <VideoCard type="add" data={item} />
                        </div>
                    ))}
                </InfiniteScroll>
            )
            }
        </div>
    );
}

export default Home;
