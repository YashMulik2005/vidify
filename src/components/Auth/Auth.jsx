import React from 'react'
import bggif from './4CND.gif'
import { Outlet } from 'react-router-dom'

function Auth() {
    return (
        <div className='flex flex-col sm:flex-row sm:h-[100vh] h-[100svh]'>
            <div className=' max-h-[20%] sm:max-h-[100%] max-w-[100%] sm:max-w-[40%] w-[40%] flex flex-col justify-center items-center ' style={{ backgroundImage: `url(${bggif})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '100%' }}>
                <h1 className=' text-white text-[27px] sm:text-[35px] font-bold text-center'>Welcome to StreamSpot</h1>
                <h1 className=' text-white'>Discover, Play, StreamSpot</h1>
            </div>
            <div className=' w-[100%] sm:w-[60%]  h-[80%] sm:h-[100%]' >
                {<Outlet />}
            </div>
        </div>
    )
}

export default Auth
