import React from "react";
import Blockies from "react-blockies";
import {useThemeContext} from "../contexts/Theme";

const Identicon = ({seed = "0x0000000000000000000000000000000000000000", scale, className}) => {
    const {theme} = useThemeContext();
    return (
        <div>
            <Blockies
                seed={seed}
                size={10} /* number of squares wide/tall the image will be; default = 15 */
                scale={scale} /* width/height of each square in pixels; default = 4 */
                color={theme == "os" ? "#8b5cf6" : "#10b981"} /* normal color; random by default */
                bgColor="#ffffff00" /* background color; random by default */
                spotColor="#ffffff00" /* color of the more notable features; random by default */
                className={`rounded border-2 ${
                    theme == "os" ? "border-os-500" : "border-od-500"
                } p-1 ${className}`} /* optional class name for the canvas element; "identicon" by default */
            />
        </div>
    );
};

export default Identicon;
