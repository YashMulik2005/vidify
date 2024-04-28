import React from 'react'
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import useMain from '../Context/MainContext'

function ChannelCardSkeleton() {
    const { darkstate } = useMain();
    const baseColor = darkstate ? '#1f1f1f' : '#e1e1e8';
    const highlightColor = darkstate ? '#0f3048' : '#ffffff';
    return (
        <div className=' dark:text-white cursor-pointer bg-bg_white border dark:border-none dark:bg-medium_black rounded-lg p-3'>
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                <section className=' flex items-center justify-between mb-2'>
                    <Skeleton circle width={50} height={50} />
                    <Skeleton width={50} />
                </section>
                <Skeleton className='w-[50%]' />
                <Skeleton className='w-[100%]' />
                <Skeleton className='w-[50%]' />
            </SkeletonTheme>
        </div>
    )
}

export default ChannelCardSkeleton