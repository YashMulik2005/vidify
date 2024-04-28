import React from 'react'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function RelatedVideoCard({ data }) {
    const navigate = useNavigate();
    return (
        <div className=' flex flex-row w-full my-4 cursor-pointer' onClick={() => {
            navigate(`/video/${data._id}`)
            window.location.reload()
        }}>
            <section className=' w-[40%] '>
                <img className='rounded-lg aspect-video w-full' src={data?.thumbnail} />
            </section>
            <section className=' w-[60%] pl-2'>
                <h1 className=' text-black dark:text-white line-clamp-2'>{data.title}</h1>
                <p className=' text-gray-500 text-sm'>{data.channel.name}</p>
                <section className=' flex text-gray-500 text-xs mt-1 justify-between'>
                    <p>{data?.views} views</p>
                    <p>{moment(data?.time).fromNow()}</p>
                </section>
            </section>
        </div>
    )
}

export default RelatedVideoCard