import React from 'react'
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import useMain from '../Context/MainContext'

function SubcribedCardSkeleton() {
    const { darkstate } = useMain();
    const baseColor = darkstate ? '#1f1f1f' : '#e1e1e8';
    const highlightColor = darkstate ? '#0f3048' : '#ffffff';
    return (
        <div className=' flex flex-col items-center gap-1 '>
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                <Skeleton circle width={40} height={40} />
                <Skeleton width={50} />
            </SkeletonTheme>
        </div>
    )
}

export default SubcribedCardSkeleton