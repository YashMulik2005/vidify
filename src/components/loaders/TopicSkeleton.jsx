import React from 'react'
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import useMain from '../Context/MainContext'

function TopicSkeleton() {
    const { darkstate } = useMain();
    const baseColor = darkstate ? '#1f1f1f' : '#e1e1e8';
    const highlightColor = darkstate ? '#0f3048' : '#ffffff';
    return (
        <div className=' pt-2'>
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                <Skeleton width={70} />
            </SkeletonTheme>
        </div>
    )
}

export default TopicSkeleton