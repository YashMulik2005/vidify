import React from 'react'
import imgage from "../../assets/noData.png"

function CommentCard() {
    return (
        <section className=' flex items-start gap-3 my-7 '>
            <img className=' rounded-full w-10 h-10 object-cover'
                src={imgage} />
            <section >
                <section className=' flex gap-2 items-center'>
                    <h1 className=' dark:text-white text-black'>Yash Mulik</h1>
                    <p className=' text-gray-500 text-sm'>5 min ago</p>
                </section>
                <p className=' text-sm text-black dark:text-white'>In literary theory, a text is any object that can be "read", whether this object is a work of literature, a street sign, an arrangement of buildings on a city block, or styles of clothing.</p>
            </section>
        </section>
    )
}

export default CommentCard