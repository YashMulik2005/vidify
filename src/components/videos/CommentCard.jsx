import React, { useEffect, useState } from 'react'
import imgage from "../../assets/noData.png"
import axios from 'axios'
import moment from 'moment'

function CommentCard({ data, index }) {
    // console.log(data, 909089);
    const [commentData, setcommentData] = useState()
    const [userdata, setuserdata] = useState()

    const getdata = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/comment/${data}`)
        // console.log(res);
        setcommentData(res.data.data);
    }
    const getuser = async () => {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/${commentData?.user}`);
        setuserdata(res.data.data)
    }

    useEffect(() => {
        getdata()
    }, []);

    useEffect(() => {
        getuser()
    }, [commentData])

    return (
        <section className=' flex items-start gap-3 my-7 '>
            <img className=' rounded-full w-10 h-10 object-cover'
                src={imgage} />
            <section >
                <section className=' flex gap-2 items-center'>
                    <h1 className=' dark:text-white text-black'>{userdata?.username}</h1>
                    <p className=' text-gray-500 text-sm'>{commentData?.time ? moment(commentData.time).fromNow() : "---"}</p>
                </section>
                <p className=' text-sm text-black dark:text-white'>{commentData?.text}</p>
            </section>
        </section>
    )
}

export default CommentCard