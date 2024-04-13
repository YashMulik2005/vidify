import React, { createContext, useContext, useEffect, useState } from 'react'

const MainContext = createContext();

export const MainProvider = ({ children }) => {

    useEffect(() => {
        if (!localStorage.getItem("theme")) {
            localStorage.setItem("theme", "white");
        }
    }, [])

    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') == "dark" ? localStorage.getItem('theme') : "");
    const [darkstate, setdarkstate] = useState(darkMode == "" ? false : true);
    const [sidebarSize, setsidebarSize] = useState(false);
    const [path, setpath] = useState(window.location.pathname == "/" ? "home" :
        window.location.pathname == "/home" ? "home" :
            window.location.pathname == "/channel" ? "channel" :
                window.location.pathname == "/your" ? "your" : "home");

    const [selectChannel, setselectChannel] = useState("all")

    const toggletheme = () => {
        if (darkstate) {
            localStorage.setItem('theme', 'white');
            setdarkstate(!darkstate);
        } else {
            localStorage.setItem('theme', 'dark');
            setdarkstate(!darkstate);
        }
    }

    const value = {
        darkMode,
        darkstate,
        setdarkstate,
        toggletheme,
        sidebarSize,
        setsidebarSize,
        path,
        setpath,
        setselectChannel,
        selectChannel
    }
    return <MainContext.Provider value={value}>{children}</MainContext.Provider>
}

const useMain = () => {
    const context = useContext(MainContext);
    return context;
}

export default useMain;