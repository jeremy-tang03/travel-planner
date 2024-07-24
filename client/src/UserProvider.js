import React, { createContext, useState } from 'react';

// Create a context with an empty object as the default value
export const UserContext = createContext({});

const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ name: '' });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
