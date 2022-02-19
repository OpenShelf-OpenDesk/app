import "../styles/globals.css";
import ThemeContext from "../contexts/Theme";
import LoadingContext from "../contexts/Loading";
import {useState} from "react";
import LoadingView from "../components/LoadingView";

function MyApp({Component, pageProps}) {
    const [theme, setTheme] = useState("os");
    const [loading, setLoading] = useState(false);

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            <LoadingContext.Provider value={{loading, setLoading}}>
                <LoadingView loading={loading} />
                <div className={`transition duration-500 ease-in-out ${loading && "blur-md"}`}>
                    <Component {...pageProps} />
                </div>
            </LoadingContext.Provider>
        </ThemeContext.Provider>
    );
}

export default MyApp;
