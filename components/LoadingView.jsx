import LoadingAnimation from "./LoadingAnimation";

const LoadingView = ({loading}) => {
    return (
        <section
            className={`fixed z-50 flex h-full w-full items-center justify-center ease-in-out ${
                !loading && "hidden"
            }`}>
            <div className="flex flex-col items-center justify-center space-y-8">
                <LoadingAnimation
                    className={`transition-all duration-100 ease-in-out ${
                        loading ? "scale-100" : "scale-0"
                    }`}
                />
                <span className="text-3xl font-semibold">Loading</span>
            </div>
        </section>
    );
};

export default LoadingView;
