import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import SideBar from './SideBar';

function Layout() {
    return (
        <div>
            <div><Navbar /></div>
            <div className=' dark:bg-dark_black bg-bg_white h-[92svh] sm:h-[92vh] max-h-[92vh] grid grid-cols-1 sm:grid-cols-[80px_auto]' >
                <div className={`hidden sm:block border-r dark:border-none transition-all duration-300 ease-in-out`}>
                    <SideBar />
                </div>
                <Outlet />
            </div>
        </div>
    )
}

export default Layout