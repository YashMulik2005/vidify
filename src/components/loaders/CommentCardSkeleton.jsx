import React from 'react'
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import useMain from '../Context/MainContext'

function CommentCardSkeleton() {
    const { darkstate } = useMain();
    const baseColor = darkstate ? '#1f1f1f' : '#e1e1e8';
    const highlightColor = darkstate ? '#0f3048' : '#ffffff';
    return (
        <section className=' flex items-start gap-3 my-7'>
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                <Skeleton circle width={30} height={30} />
                <section className=' w-[100%]'>
                    <section className=' flex gap-2 items-center'>
                        <Skeleton width={100} />
                        <Skeleton width={100} />
                    </section>
                    <Skeleton className=' w-[50%]' />
                </section>
            </SkeletonTheme>
        </section>
    )
}

export default CommentCardSkeleton