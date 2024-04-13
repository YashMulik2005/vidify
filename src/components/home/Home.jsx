import React, { useEffect, useState } from 'react';
import useMain from '../Context/MainContext';
import AuthHook from '../Context/AuthContext';
import axios from 'axios';
import Topics from './Topics';
import VideoCard from '../videos/VideoCard';
import noData from '../../assets/noData.png';
import VideoCardSkeleton from '../loaders/VideoCardSkeleton';
import useLoader from '../Context/LoaderContext';
import TopicSkeleton from '../loaders/TopicSkeleton';

function Home() {
    const { setuserDetailsLoader } = AuthHook();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { videoCardLoader } = useLoader();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/video/getvideos`);
                setData(res.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='overflow-x-auto relative'>
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
            {!loading && data.length === 0 && (
                <div className='w-[90vw] flex justify-center items-center flex-col mt-[-15px]'>
                    <img src={noData} className='w-40 h-40' alt="No data" />
                    <h1 className='dark:text-white text-black'>No video Found</h1>
                </div>
            )}
            {!loading && data.length > 0 && (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 mt-1 p-3'>
                    {data.map((item, index) => (
                        <div key={index} className="relative z-10">
                            <VideoCard type="add" data={item._id} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
