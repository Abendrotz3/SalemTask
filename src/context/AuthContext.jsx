import { createContext, useEffect, useState, useContext} from "react";
import {supabase} from "../supabaseClient";

const AuthContext = createContext()
export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined)

    //Sign Up
    const singUpNewUser = async (email, password) => {
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        

        if(error){
            console.error("Deal Gone Wrong", error);
            return{ success:false, error };
        }
        return { success:true, data };
    };

    // Sign In
    const signInUser = async (email, password) => {
        try{
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if(error){
                console.error('sign in error ocurred: ', error);
                return {success: false, error: error.message}
            }
            console.log("sign in sucess: ", data)
            return{success:true, data}
        } catch(error) {
            console.error("an error ocurred: ", error)
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

    }, []);

    //Sing out
    const signOut = () => {
        const { error } = supabase.auth.signOut();

        if(error){
            console.error("there was an error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{session, singUpNewUser, signInUser, signOut}}>
            {children}
        </AuthContext.Provider>
    );
}

export const UserAuth = () => {
    return useContext(AuthContext);
};