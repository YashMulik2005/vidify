import React, { createContext, useContext, useState } from 'react';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [videoCardLoader, setVideoCardLoader] = useState(false);
    const value = {
        setVideoCardLoader,
        videoCardLoader
    };
    return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>;
};

const useLoader = () => {
    const context = useContext(LoaderContext);
    return context;
};

export default useLoader;
