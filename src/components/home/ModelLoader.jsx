import React from 'react'
import { MoonLoader } from 'react-spinners'

function ModelLoader({ data }) {
    return (
        <div className={` ${data ? "" : "hidden"} z-10 inset-0 bg-opacity-5 bg-gray-600 flex justify-center items-center backdrop-blur-md  absolute left-0 top-0  w-[100%] h-[100%] dark:text-white text-black `}>
            <MoonLoader size={40} color="red" className=' z-30 text-red-600' />
        </div>
    )
}

export default ModelLoader