import React from 'react'
import VideoCardSkeleton from './VideoCardSkeleton'
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import useMain from '../Context/MainContext'

function ProfileSkeleton() {
    const { darkstate } = useMain();
    const baseColor = darkstate ? '#1f1f1f' : '#f5f2f2';
    const highlightColor = darkstate ? '#0f3048' : '#ffffff';
    return (
        <div className='px-5 py-1 overflow-y-auto'>
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                <section className=' flex justify-between sm:pr-10 py-1'>
                    <div className=' flex justif-start items-center w-[60%]'>
                        <Skeleton circle width={100} height={100} />
                        <div>
                            <Skeleton className='w-[90%]' />
                            <h1 className='text-gray-600'> <Skeleton className='w-[90%]' /></h1>
                            <p className='text-gray-600'> <Skeleton className='w-[90%]' /></p>
                            <Skeleton className='w-[90%]' />
                        </div>
                    </div>
                    <div className=' my-[8px] p-2 rounded-lg '>
                        <p className=' dark:text-white text-black text-sm'><Skeleton className='w-[100%]' /></p>
                        <section className=' flex flex-row-reverse items-center gap-3'>
                            <Skeleton circle width={60} height={60} />
                            <section>
                                <h2 className='dark:text-white text-black font-semibold'><Skeleton className='w-[90%]' /></h2>
                                <Skeleton className='w-[90%]' />
                                <Skeleton className='w-[90%]' />
                            </section>
                        </section>
                    </div>
                </section>
                <div className=' border border-gray-500 '></div>
                <section className=' py-3'>
                    <setcion className="flex justify-between px-3 py-1 dark:text-white text-black">
                        <h1><Skeleton className='w-[90%]' /></h1>
                        <h1 className=' cursor-pointer'><Skeleton className='w-[90%]' /></h1>
                    </setcion>
                    <div className=' grid grid-cols-1 sm:grid-cols-4 overflow-x-auto'>
                        <VideoCardSkeleton />
                        <VideoCardSkeleton />
                        <VideoCardSkeleton />
                        <VideoCardSkeleton />
                    </div>
                </section>
                <div className=' border border-gray-500 '></div>
                <section>
                    <setcion className="flex justify-between px-3 py-1 dark:text-white text-black">
                        <h1><Skeleton className='w-[90%]' /></h1>
                        <h1 className=' cursor-pointer text-sm'><Skeleton className='w-[90%]' /></h1>
                    </setcion>
                    <div className=' flex flex-wrap gap-2 text-sm justify-center items-center p-2'>
                        <Skeleton className='w-[90%]' />
                        <Skeleton className='w-[90%]' />
                        <Skeleton className='w-[90%]' /><Skeleton className='w-[90%]' />
                        <Skeleton className='w-[90%]' />
                        <Skeleton className='w-[90%]' /><Skeleton className='w-[90%]' />
                    </div>
                </section>
            </SkeletonTheme>
        </div>
    )
}

export default ProfileSkeleton