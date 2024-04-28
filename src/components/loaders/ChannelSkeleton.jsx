import React from 'react'
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import useMain from '../Context/MainContext'
import VideoCardSkeleton from './VideoCardSkeleton';


function ChannelSkeleton() {
    const { darkstate } = useMain();
    const baseColor = darkstate ? '#1f1f1f' : '#f5f2f2';
    const highlightColor = darkstate ? '#0f3048' : '#ffffff';
    return (
        <div>
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                <section className=' hidden sm:block'>
                    <Skeleton className='w-full rounded-xl' height={150} />
                </section>

                <section className=' grid grid-col-1 sm:grid-cols-[180px_auto] items-center my-4 mx-2'>
                    <section className=' flex justify-center'>
                        <Skeleton circle width={100} height={100} />
                    </section>
                    <section className=' '>
                        <h1 className='mt-2 font-semibold dark:text-white text-black'><Skeleton className='w-[40%] text-[15px]' /></h1>
                        <h1 className=' mt-3'>
                            <Skeleton className='w-[90%]' />
                            <Skeleton className=' w-[90%]' />
                            <Skeleton className=' w-[90%]' />
                        </h1>
                        <Skeleton className=' text-[25px] mt-3 rounded-xl w-[30%]' />
                        <Skeleton className='text-[18px] mt-2 rounded-lg w-[20%]' />
                    </section>
                </section>

                <section className=' mt-2'>
                    <h1 className=' dark:text-white text-black'> <Skeleton className='w-[10%]' /></h1>
                    <div className=' border-t border-gray-500 mt-1'></div>
                    <div className=' grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2'>
                        <VideoCardSkeleton />
                        <VideoCardSkeleton />
                        <VideoCardSkeleton />
                        <VideoCardSkeleton />
                    </div>
                </section>
            </SkeletonTheme>
        </div>
    )
}

export default ChannelSkeleton