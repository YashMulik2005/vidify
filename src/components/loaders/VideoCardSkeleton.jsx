import React from 'react'
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import useMain from '../Context/MainContext'

function VideoCardSkeleton() {
    const { darkstate } = useMain();
    const baseColor = darkstate ? '#1f1f1f' : '#f5f2f2';
    const highlightColor = darkstate ? '#0f3048' : '#ffffff';
    return (
        <div className=' rounded-lg p-1 '>
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                <section>
                    <div>
                        <Skeleton className='w-full' height={130} />
                    </div>
                </section>
                <div className=' grid grid-cols-[45px_auto] mt-2 gap-1'>
                    <Skeleton circle width={35} height={35} />
                    <section >
                        <Skeleton className='w-full' />
                        <Skeleton width={130} />
                        <section className=' mt-1 text-gray-600 flex text-[10px] justify-between items-center w-[full]'>
                            <Skeleton width={70} />
                            <Skeleton width={70} />
                        </section>
                    </section>
                </div>
            </SkeletonTheme>
        </div>


    )
}

export default VideoCardSkeleton