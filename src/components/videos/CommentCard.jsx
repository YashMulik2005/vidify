import React, { useEffect, useState } from 'react'
import imgage from "../../assets/user_default.png"
import axios from 'axios'
import moment from 'moment'
import CommentCardSkeleton from '../loaders/CommentCardSkeleton'
import AuthHook from '../Context/AuthContext'

function CommentCard({ data }) {
    // console.log(data, 909089);
    const [commentData, setcommentData] = useState()
    const [userdata, setuserdata] = useState()
    const [loader, setloader] = useState(false)
    // const { userDetails } = AuthHook()


    const getdata = async () => {
        setloader(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/comment/${data}`)
        // console.log(res);
        setcommentData(res.data.data);
        setuserdata(res.data.data.user)
        setloader(false)
    }

    useEffect(() => {
        getdata()
    }, []);


    return (
        <section className=''>
            {
                loader ? <CommentCardSkeleton /> :
                    <section className=' flex items-start gap-3 my-7 '>
                        <img className=' rounded-full w-10 h-10 object-cover'
                            src={userdata?.profile_image ? userdata.profile_image : imgage} />
                        <section >
                            <section className=' flex gap-2 items-center'>
                                <h1 className=' dark:text-white text-black'>{userdata?.username}</h1>
                                <p className=' text-gray-500 text-xs'>{commentData?.time ? moment(commentData.time).fromNow() : "---"}</p>
                            </section>
                            <p className=' text-sm text-black dark:text-white'>{commentData?.text}</p>
                        </section>
                    </section>
            }
        </section>
    )
}

export default CommentCard