import React from 'react'
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import useMain from '../Context/MainContext'

function RelatedVideoSkeleton() {
    const { darkstate } = useMain();
    const baseColor = darkstate ? '#1f1f1f' : '#e1e1e8';
    const highlightColor = darkstate ? '#0f3048' : '#ffffff';
    return (
        <div className=' flex flex-row w-full my-4 cursor-pointer'>
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                <section className=' w-[40%]  '>
                    <Skeleton width={160} height={80} />
                </section>
                <section className=' w-[60%] pl-2'>
                    <Skeleton width={200} />
                    <Skeleton width={70} />
                    <section className=' flex text-gray-400 text-xs mt-1 gap-3'>
                        <Skeleton width={50} />
                        <Skeleton width={50} />
                    </section>
                </section>
            </SkeletonTheme >
        </div>
    )
}

export default RelatedVideoSkeleton