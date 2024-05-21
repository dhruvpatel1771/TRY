import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        // Retrieve data from cookie and convert it to a string
        localStorage.getItem("user") || null
    );

    const updateUser = (data) => {
        setCurrentUser(data);
    };

    useEffect(() => {
        // Convert currentUser to a JSON string before storing in localStorage
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
