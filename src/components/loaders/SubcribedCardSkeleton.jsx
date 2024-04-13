import React from 'react'

function SubcribedCardSkeleton() {
    return (
        <div className=' flex flex-col items-center gap-2 '>
            <div className="skeleton h-9 w-9 rounded-full shrink-0 bg-white dark:bg-light_black"></div>
            <div className=' skeleton w-10 h-2 bg-white dark:bg-light_black'></div>
        </div>
    )
}

export default SubcribedCardSkeleton