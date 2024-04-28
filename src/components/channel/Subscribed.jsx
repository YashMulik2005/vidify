import React, { useEffect, useState } from 'react'
import SubcribedCard from './SubcribedCard'
import AuthHook from '../Context/AuthContext';
import useMain from '../Context/MainContext';
import axios from 'axios';
import VideoCard from '../videos/VideoCard';
import VideoCardSkeleton from '../loaders/VideoCardSkeleton';
import noData from '../../assets/noData.png';
import SubcribedCardSkeleton from '../loaders/SubcribedCardSkeleton';
import InfiniteScroll from 'react-infinite-scroll-component';
import Unauthorized from '../../errors/Unauthorized';

function Subscribed() {
    const { selectChannel } = useMain()
    const { userDetails, token, islogedIn } = AuthHook();
    const [videoData, setvideoData] = useState()
    const [loader, setloader] = useState(false)
    const [currentPage, setcurrentPage] = useState(0)
    const [moreData, setmoreData] = useState(false)

    const getAllVidoes = async () => {
        if (islogedIn) {
            setloader(true);
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/feed/subscribedData`, {
                headers: {
                    "authentication": `bearer ${token}`
                }
            });
            setcurrentPage(res.data.response.currentPage);
            setmoreData(res.data.response.moreData)
            setvideoData(res.data.response.data);
            setloader(false);
        }
    };


    const getSelectedVideo = async () => {
        console.log("vytvygcv");
        if (islogedIn) {
            setloader(true)
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/video/channel/${selectChannel}`, {
                headers: {
                    "authentication": `bearer ${token}`
                }
            })
            setcurrentPage(res.data.response.currentPage);
            setmoreData(res.data.response.moreData)
            setvideoData(res.data.response.data)
            setloader(false)
        }
    }

    const fetchMore = async () => {
        let url;
        if (selectChannel == "all") {
            url = `${import.meta.env.VITE_BACKEND_URL}/feed/subscribedData?page=${currentPage + 1}`
        } else {
            url = `${import.meta.env.VITE_BACKEND_URL}/video/channel/${selectChannel}?page=${currentPage + 1}`
        }

        const res = await axios.get(url, {
            headers: {
                "authentication": `bearer ${token}`
            }
        })
        setcurrentPage(res.data.response.currentPage);
        setmoreData(res.data.response.moreData)
        setvideoData(prev => [...prev, ...res.data.response.data])
    }

    useEffect(() => {
        if (selectChannel == "all") {
            getAllVidoes()
        } else {
            getSelectedVideo()
        }
    }, [selectChannel])

    return (
        <div className=' w-[100%] overflow-x-auto' id='scrollContainer'>
            {
                userDetails ? <section>
                    <div className='w-[100%] flex items-center gap-4 px-4 py-[6px] overflow-x-auto'>
                        {
                            userDetails?.subscribed?.map((item) => {
                                return <SubcribedCard key={item} data={item} />
                            })
                        }
                    </div>
                    <div className='border-b  dark:border-[#353333]'></div>
                    {/* {moreData ? "yes" : "no"}
                    {currentPage} */}
                    <div>
                        {
                            loader ? <div className=' grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 gap-3'>
                                <VideoCardSkeleton />
                                <VideoCardSkeleton />
                                <VideoCardSkeleton />
                                <VideoCardSkeleton />
                            </div> :
                                videoData?.length == 0 ? <div className='w-[90vw] flex justify-center items-center flex-col mt-[-15px]'>
                                    <img src={noData} className='w-40 h-40' alt="No data" />
                                    <h1 className='dark:text-white text-black'>No video Found</h1>
                                </div> :
                                    <InfiniteScroll
                                        dataLength={videoData?.length ? videoData.length : 0}
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
                                        {
                                            videoData?.map((item) => {
                                                return <VideoCard key={item._id} data={item} type="all" />
                                            })}
                                    </InfiniteScroll>
                        }
                    </div>
                </section> : <div className=' w-[100%] h-[100%]'>
                    <Unauthorized msg="subscribers" />
                </div>
            }


        </div>
    )
}

export default Subscribed