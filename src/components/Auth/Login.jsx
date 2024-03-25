import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import cookies from 'js-cookie'
import toast from 'react-hot-toast';
import AuthHook from '../Context/AuthContext';
import { PulseLoader } from 'react-spinners'
import { useState } from 'react';

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { settoken } = AuthHook()
    const [loader, setloader] = useState(false)

    const onSubmit = async (data, e) => {
        e.preventDefault();
        setloader(true)
        const res = await axios.post("http://localhost:3000/api/auth/login", { username: data.username, password: data.password })
        console.log(res);
        if (res.data.data.status) {
            cookies.set("token", res.data.data.token, { expires: 4 })
            settoken(cookies.get("token"))
            navigate("/")
        }
        else {
            toast.error(res.data.data.msg)
        }
        setloader(false)
        // data.username = "";
        // data.password = "";
    };

    return (
        <div className='flex justify-center items-center flex-col p-2 px-4 h-[100%] bg-bg_white dark:bg-medium_black'>
            <h1 className='text-[25px] font-bold my-5 text-black dark:text-white'>Login to your Account</h1>
            <hr />
            <form className='w-[100%] sm:w-[60%]' onSubmit={handleSubmit(onSubmit)}>
                <label className='dark:text-gray-400 text-gray-500 my-2'>Username: </label>
                <br />
                <input type='text' {...register('username', { required: true })} className='border dark:bg-light_black bg-bg_white text-black dark:text-white rounded-xl px-3 py-[10px] dark:border-none w-[100%] my-2 focus:outline-none' />
                {errors.username && <span className='text-red-500'>Username is required</span>}
                <br />
                <label className='dark:text-gray-400 text-gray-500 my-2'>Password: </label>
                <br />
                <input
                    type='password'
                    {...register('password', { required: true, minLength: 8 })}
                    className='border rounded-xl px-3 py-[10px] w-[100%] my-2 bg-bg_white dark:bg-light_black text-black dark:text-white dark:border-none focus:outline-none'
                />
                {errors.password && errors.password.type === 'required' && (
                    <span className='text-red-500'>Password is required</span>
                )}
                {errors.password && errors.password.type === 'minLength' && (
                    <span className='text-red-500'>Password must be at least 8 characters long</span>
                )}
                <br />
                <div className='flex flex-col sm:flex-row items-center justify-between'>
                    <button type='submit' className={` w-28 m-2 rounded-full py-[8px] px-6 bg-red-600 text-white font-semibold hover:bg-black hover:text-white`}>
                        {loader ? <PulseLoader size={8} color='white' /> : "Login"}
                    </button>
                    <p className='cursor-pointer hover:underline text-sm sm:text-md text-black dark:text-white'>Don't have an account? <span onClick={() => {
                        navigate("/auth/signup")
                    }} className='text-blue-700'>Signup</span></p>
                </div>
            </form>
        </div>
    );
}

export default Login;
