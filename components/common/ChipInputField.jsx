import {XCircleIcon} from "@heroicons/react/solid";
import {useThemeContext} from "../../contexts/Theme";

const ChipInputField = ({chips, setChips, className, placeholder}) => {
    const {theme} = useThemeContext();

    const addChip = item => {
        setChips(state => {
            return [...state, item];
        });
    };
    const removeChip = index => {
        const chip = chips.slice();
        chip.splice(index, 1);
        setChips(chip);
    };

    return (
        <div
            className={`flex w-full snap-x flex-wrap space-x-1 rounded border-2 border-gray-300 p-2 font-medium focus-within:border-blue-300 focus-within:shadow focus-within:shadow-blue-300/50 focus-within:outline-none focus-within:ring-0 ${className}`}>
            {chips.map((chip, index) => {
                return (
                    <span
                        key={index}
                        className={`my-0.5 flex h-min items-center justify-between gap-x-1.5 self-center rounded px-1.5 text-xs font-semibold text-white hover:shadow lg:text-sm ${
                            theme === "os"
                                ? "bg-os-500 hover:shadow-os-500/50"
                                : "bg-od-500 hover:shadow-od-500/50"
                        }`}>
                        {chip}
                        <XCircleIcon
                            className="h-[14px] w-[14px] cursor-pointer"
                            onClick={() => {
                                removeChip(index);
                            }}
                        />
                    </span>
                );
            })}

            <input
                className="w-min snap-end bg-transparent pl-2 font-medium outline-none ring-0 placeholder:text-sm placeholder:text-gray-400"
                placeholder={placeholder}
                onKeyDownCapture={e => {
                    if (e.key === "Enter" || e.key === ",") {
                        if (e.target.value !== "") {
                            const value = e.target.value;
                            e.target.value = "";
                            addChip(value);
                        }
                    } else if (e.key === "Backspace") {
                        e.target.value === "" && removeChip(chips.length - 1);
                    }
                }}
                onKeyUpCapture={e => {
                    if (e.key === "Enter" || e.key === ",") {
                        e.target.value = "";
                    }
                }}
            />
        </div>
    );
};

export default ChipInputField;
