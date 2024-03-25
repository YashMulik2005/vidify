import React from 'react'
import { useNavigate } from 'react-router-dom'


function ChannelCard({ data }) {
    console.log(data, 9090);
    const navigate = useNavigate();
    return (
        <div onClick={() => {
            navigate(`/channel/${data?._id}`)
        }} className=' dark:text-white cursor-pointer bg-white border dark:border-none dark:bg-medium_black rounded-lg p-3 gap1 flex flex-col justify-center items-center'>
            <img className=' w-40 h-40  rounded-full object-contain'
                src={data?.profile_image} />
            <h1 className='mt-2 font-semibold text-black  dark:text-white'>{data?.name}</h1>
            <h1 className=' text-center line-clamp-3 text-sm text-gray-500'>{data?.description}</h1>
            <h1 className=' text-black  dark:text-white'> {data?.subscribers.length} subscribers</h1>
            <button onClick={(e) => {
                e.stopPropagation();
                console.log("subscribed")
            }} className=' bg-red-500 text-sm text-white px-5 py-[4px] rounded-full'>subcribe</button>
        </div>
    )
}

export default ChannelCard