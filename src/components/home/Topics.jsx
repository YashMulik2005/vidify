import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PulseLoader } from 'react-spinners'
import { HashLoader } from 'react-spinners'
import AuthHook from '../Context/AuthContext'
import TopicSkeleton from '../loaders/TopicSkeleton'
import useMain from '../Context/MainContext'

function Topics() {
    const [dataloader, setdataloader] = useState(false)
    const [category, setcategory] = useState([]);
    const { selectedTpic, setselectedTpic } = useMain();

    const getCategory = async () => {
        setdataloader(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/category/getCategory?search=`)
        setcategory(res.data.data.category)
        setdataloader(false)
    }

    const handleTopic = (id) => {
        setselectedTpic(id);
    }

    useEffect(() => {
        getCategory()
    }, [])

    return (
        <div className='w-[100%] overflow-x-auto dark:text-white text-sm py-3'>
            {dataloader ? (
                <section className=' flex gap-3'>
                    <TopicSkeleton /><TopicSkeleton /><TopicSkeleton /><TopicSkeleton /><TopicSkeleton /><TopicSkeleton /><TopicSkeleton /><TopicSkeleton />
                </section>
            ) : (
                <>
                    <span onClick={() => setselectedTpic("all")} className={`${selectedTpic === "all" ? "bg-red-500 text-white dark:bg-white dark:text-black" : "dark:bg-light_black bg-white dark:text-white text-black"} select-none whitespace-nowrap rounded-lg mx-[5px] px-3 py-1 cursor-pointer`}>
                        All
                    </span>
                    {category?.map((item, index) => (
                        <span key={index} onClick={() => handleTopic(item._id)} className={`${selectedTpic === item._id ? "bg-red-500 text-white dark:bg-white dark:text-black" : "dark:bg-light_black dark:text-white bg-white text-black"} select-none whitespace-nowrap rounded-lg mx-[5px] px-3 py-1 cursor-pointer`}>
                            {item.name}
                        </span>
                    ))}
                </>
            )}
        </div>


    )
}

export default Topics