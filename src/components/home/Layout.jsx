import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import SideBar from './SideBar';
import AuthHook from '../Context/AuthContext';
import { PuffLoader } from 'react-spinners'

function Layout() {
    const { userDetailsLoader } = AuthHook()
    return (
        // 113853
        <div className='relative '>
            <div className='absolute inset-0 bg-gradient-to-tr dark:from-[#121e26] dark:via-[#12100E] dark:to-[#113853] from-[#c6deef] via-[#e8e8ec] to-[#a9d0eb]   blur-sm ' ></div>
            <div className='relative z-10'>
                <div><Navbar /></div>
                <div className=' h-[90svh] sm:h-[90vh] max-h-[90vh] grid grid-cols-1 sm:grid-cols-[80px_auto]'>
                    <div className={`hidden sm:block border-r dark:border-none transition-all duration-300 ease-in-out`}>
                        <SideBar />
                    </div>
                    <Outlet />
                </div>
                {userDetailsLoader && (
                    <div className="absolute inset-0 bg-opacity-100 bg-gray-900 backdrop-blur-md flex justify-center items-center dark:text-white text-black">
                        <PuffLoader size={45} color="red" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Layout
