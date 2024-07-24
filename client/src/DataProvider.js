import React, { createContext, useState } from 'react';

// Create a context with an empty object as the default value
export const DataContext = createContext({});

const DataProvider = ({ children }) => {
    const [data, setData] = useState(null);

    return (
        <DataContext.Provider value={{ data, setData }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;
