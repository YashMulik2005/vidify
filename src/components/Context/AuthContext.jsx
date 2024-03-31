import React, { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [formdata, setformdata] = useState();
    const [token, settoken] = useState(Cookies.get("token") ? Cookies.get("token") : undefined)
    const [userDetails, setuserDetails] = useState({})
    const [userDetailsLoader, setuserDetailsLoader] = useState(true);

    // const refreshToken = async (teq, res) => {
    //     if (Cookies.get("token")) {
    //         const res = await axios.get("http://localhost:3000/api/auth/refreshToken", {
    //             headers: {
    //                 "authentication": `bearer ${token}`
    //             }
    //         })
    //         console.log(res.data.data.token, 88979);
    //         Cookies.set("token", res.data.data.token, { expires: 4 });
    //         settoken(res.data.data.token);
    //     }
    // }

    // useEffect(() => {
    //     refreshToken();
    // }, [])


    const value = {
        formdata,
        setformdata,
        token,
        settoken,
        userDetails,
        setuserDetails,
        userDetailsLoader,
        setuserDetailsLoader
    }
    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

const AuthHook = () => {
    const context = useContext(AuthContext);
    return context;
}

export default AuthHook;