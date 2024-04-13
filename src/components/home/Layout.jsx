import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import SideBar from './SideBar';
import AuthHook from '../Context/AuthContext';
import { MoonLoader } from 'react-spinners'

function Layout() {
    const { setuserDetailsLoader, userDetailsLoader } = AuthHook()
    return (
        <div className='relative '>
            <div className='absolute inset-0 bg-gradient-to-tr dark:from-[#000000] dark:via-[#12100E] dark:to-[#04619F] from-[#fafaff] via-[#fafaff] to-[#04619F]   blur-sm ' ></div>
            <div className='relative z-10'>
                <div><Navbar /></div>
                <div className=' h-[92svh] sm:h-[92vh] max-h-[92vh] grid grid-cols-1 sm:grid-cols-[80px_auto]'>
                    <div className={`hidden sm:block border-r dark:border-none transition-all duration-300 ease-in-out`}>
                        <SideBar />
                    </div>
                    <Outlet />
                </div>
                {userDetailsLoader && (
                    <div className="absolute inset-0 bg-opacity-30 bg-gray-900 backdrop-blur-md flex justify-center items-center dark:text-white text-black">
                        <MoonLoader size={40} color="red" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Layout
