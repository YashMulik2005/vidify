import React, { useEffect, useState } from 'react'
import useMain from '../Context/MainContext'
import AuthHook from '../Context/AuthContext'
import axios from 'axios'
import { PulseLoader } from 'react-spinners'
import { HashLoader } from 'react-spinners'
import Topics from './Topics';
import VideoCard from '../videos/VideoCard'

function Home() {

    return (
        <div className=' overflow-x-auto'>
            <Topics />
            <div className=' grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 p-2'>
                <VideoCard />
                <VideoCard />
                <VideoCard />
                <VideoCard />
                <VideoCard />
                <VideoCard />
                <VideoCard />
                <VideoCard />
                <VideoCard />
                <VideoCard />
            </div>
        </div>
    )
}

export default Home