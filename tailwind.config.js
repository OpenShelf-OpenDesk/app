const colors = require("tailwindcss/colors");

module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            transitionProperty: {
                width: "width"
            }
        },
        colors: {
            transparent: colors.transparent,
            os: colors.emerald,
            od: colors.violet,
            black: colors.black,
            white: colors.white,
            gray: colors.gray,
            blue: colors.blue,
            red: colors.red,
            amber: colors.amber,
            indigo: colors.indigo
        }
    },
    variants: {
        extend: {
            fontWeight: ["hover"]
        }
    },
    plugins: [
        require("@tailwindcss/typography"),
        require("@tailwindcss/line-clamp"),
        require("@tailwindcss/aspect-ratio")
    ]
};
