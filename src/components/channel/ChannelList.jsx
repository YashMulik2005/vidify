import React, { useEffect, useState } from 'react'
import ChannelCard from './ChannelCard'
import axios from 'axios'

function ChannelList() {
    const [data, setdata] = useState()

    const featchdata = async () => {
        const res = await axios.get("http://localhost:3000/api/channel/getChennls");
        console.log(res.data.data);
        setdata(res.data.data)
    }
    useEffect(() => {
        featchdata()
    }, [])

    return (
        <div className=' p-2 flex flex-col gap-4 overflow-y-auto'>
            <h1 className=' dark:text-white text-black '>Top Channels</h1>
            <form className=' w-[100%] flex justify-center items-center'>
                <input className=' dark:bg-medium_black rounded-full text-sm px-5 py-[7px] w-[90%] bg-white text-black dark:text-text dark:border-none border focus:outline-none' placeholder='search' />
            </form>
            <div className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
                {
                    data?.map((item, index) => {
                        return <ChannelCard data={item} key={index} />
                    })
                }
            </div>

        </div>
    )
}

export default ChannelList