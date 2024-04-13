import React from 'react'

function VideoCardSkeleton() {
    return (
        <div className='relative h-full w-full flex flex-col gap-3'>
            <div className=' skeleton rounded-lg aspect-video bg-white dark:bg-light_black'></div>
            <div className=' flex items-center gap-2'>
                <div className="skeleton h-9 w-9 rounded-full shrink-0 bg-white dark:bg-light_black"></div>
                <div className=' w-full flex flex-col gap-1'>
                    <div className="skeleton w-full h-3 bg-white dark:bg-light_black"></div>
                    <div className="skeleton w-[50%] h-3 bg-white dark:bg-light_black"></div>
                    <section className=' flex justify-between items-center'>
                        <div className="skeleton w-[20%] h-3 bg-white dark:bg-light_black"></div>
                        <div className="skeleton w-[20%] h-3 bg-white dark:bg-light_black"></div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default VideoCardSkeleton