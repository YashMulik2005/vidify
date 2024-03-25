import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import AuthHook from '../Context/AuthContext';
import { PulseLoader } from 'react-spinners'
import { useState } from 'react';

function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { setformdata } = AuthHook();
    const [loader, setloader] = useState(false)

    const onSubmit = (data, e) => {
        setloader(true)
        e.preventDefault();
        console.log(data);
        setformdata(data)
        navigate("/auth/area")
        setloader(false)
    };

    return (
        <div className='flex justify-center items-center flex-col p-2 px-4 h-[100%] overflow-y-auto bg-bg_white dark:bg-medium_black'>
            <h1 className='text-[20px] sm:text-[25px] font-bold my-2 dark:text-white text-black'>Create your new Account</h1>
            <hr />
            <form className='w-[100%] sm:w-[60%]' onSubmit={handleSubmit(onSubmit)}>
                <div className=' flex gap-2'>
                    <section>
                        <label className='text-gray-500 dark:text-gray-400 mb-2 text-sm'>fname: </label>
                        <input type='text'
                            {...register('fname', { required: true })}
                            className='border rounded-xl px-3 py-[8px] w-[100%] my-1 bg-bg_white dark:bg-light_black text-black dark:text-white dark:border-none focus:outline-none' />
                        {errors.fname && <span className='text-red-500 text-sm'>fname is required</span>}
                    </section>
                    <section>
                        <label className='text-gray-500 dark:text-gray-400 mb-2 text-sm'>lname: </label>
                        <input type='text'
                            {...register('lname', { required: true })}
                            className='border rounded-xl px-3 py-[8px] w-[100%] my-1 bg-bg_white dark:bg-light_black text-black dark:text-white dark:border-none focus:outline-none' />
                        {errors.lname && <span className='text-red-500 text-sm'>lname is required</span>}
                    </section>
                </div>
                <label className='text-gray-500 dark:text-gray-400 mb-2 text-sm'>Username: </label>
                <br />
                <input type='text'
                    {...register('username', { required: true })}
                    className='border rounded-xl px-3 py-[8px] w-[100%] my-1 bg-bg_white dark:bg-light_black text-black dark:text-white dark:border-none focus:outline-none' />
                {errors.username && <span className='text-red-500 text-sm'>Username is required</span>}
                <br />
                <label className='text-gray-500  dark:text-gray-400 mb-2 text-sm'>Email:</label><br />
                <input type='email'
                    {...register('email', { required: true })}
                    className='border rounded-xl px-3 py-[8px] w-[100%] my-1 bg-bg_white dark:bg-light_black text-black dark:text-white dark:border-none focus:outline-none' />
                {errors.email && <span className='text-red-500 text-sm'>Email is required</span>}
                <br />
                <label className='text-gray-500 dark:text-gray-400 mb-2 text-sm'>Password: </label>
                <br />
                <input
                    type='password'
                    {...register('password', { required: true, minLength: 8 })}
                    className='border rounded-xl px-3 py-[8px] w-[100%] my-1 bg-bg_white dark:bg-light_black text-black dark:text-white dark:border-none focus:outline-none'
                />
                {errors.password && errors.password.type === 'required' && (
                    <span className='text-red-500 text-sm'>Password is required</span>
                )}
                {errors.password && errors.password.type === 'minLength' && (
                    <span className='text-red-500 text-sm'>Password must be at least 8 characters long</span>
                )}
                <br />
                <div className='flex flex-col sm:flex-row items-center justify-between'>
                    <button type='submit' className=' w-28 m-2 rounded-full py-[6px] sm:py-[8px] px-6 bg-red-600 text-white font-semibold hover:bg-black hover:text-white'>
                        {loader ? <PulseLoader size={10} color='white' /> : "Next"}
                    </button>
                    <p className='cursor-pointer hover:underline text-sm sm:text-md text-black dark:text-white'>Already have an account? <span onClick={() => {
                        navigate("/auth/login")
                    }} className='text-blue-700'>login</span></p>
                </div>
            </form>
        </div>
    )
}

export default Signup