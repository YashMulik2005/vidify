import React, { useEffect, useState } from 'react'
import AuthHook from '../Context/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { PulseLoader } from 'react-spinners'
import { HashLoader } from 'react-spinners'

function InterestedArea() {
    const { formdata } = AuthHook()
    const [interest_area, setinterest_area] = useState([]);
    const [category, setcategory] = useState([]);
    const navigate = useNavigate()
    const [loader, setloader] = useState(false)
    const [dataloader, setdataloader] = useState(false)

    const select_area = (item) => {
        const index = interest_area.indexOf(item._id);
        if (index != -1) {
            const new_arr = [...interest_area];
            new_arr.splice(index, 1);
            setinterest_area(new_arr);
        } else {
            setinterest_area([...interest_area, item._id])
        }
    }

    const getCategory = async () => {
        setdataloader(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/category/getCategory`)
        setcategory(res.data.data.category)
        setdataloader(false)
    }

    const handleSignup = async () => {
        setloader(true)
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
            fname: formdata.fname,
            lname: formdata.lname,
            username: formdata.username,
            email: formdata.email,
            password: formdata.password,
            interested_area: interest_area
        })
        console.log(res);
        if (res.data.data.status) {
            toast.success(res.data.data.msg);
            navigate("/auth/login")
        }
        else {
            toast.error(res.data.data.msg);
        }
        setloader(false)
    }

    useEffect(() => {
        if (!formdata) {
            navigate("/auth/signup")
        }
    }, [])


    useEffect(() => {
        getCategory()
    }, [])


    return (
        <div className='flex justify-center items-center gap-4 flex-col px-5 max-h-[100%] h-[100%] bg-bg_white dark:bg-medium_black'>
            <h1 className=' text-xl text-semibold dark:text-white text-black'>Select Interested area: </h1>
            <div className=' flex flex-wrap gap-2 justify-center items-center h-[70%] max-h-[70%]  overflow-y-scroll p-2'>
                {dataloader ? <HashLoader color='red' /> : category?.map((item, index) => {
                    return <section key={index} onClick={() => select_area(item)} className={`${interest_area.includes(item._id) ? "bg-red-600 text-white" : "bg-red-100 text-gray-500 dark:text-gray-700"} px-3 py-[5px] border dark:border-none rounded-full cursor-pointer `}>{item.name}</section>
                })}
            </div>
            <button onClick={handleSignup} className='w-28 m-2 rounded-full py-[6px] sm:py-[8px] px-6 hover:bg-red-600 hover:text-white font-semibold bg-black text-white'>
                {loader ? <PulseLoader size={10} color='white' /> : "Signup"}</button>
        </div>
    )
}

export default InterestedArea