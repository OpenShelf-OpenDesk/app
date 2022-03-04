import {CheckIcon, XIcon} from "@heroicons/react/solid";
import LoadingAnimation from "./LoadingAnimation";

const ProgressStatus = ({statusTags, status}) => {
    return (
        <section
            className={`fixed z-[90] flex h-full w-full items-center justify-center bg-white/30 transition duration-500 ease-in-out ${
                Math.abs(status) > 0 ? "backdrop-blur-xl" : "hidden backdrop-blur-none"
            }`}>
            <div className="flex flex-col items-start justify-center space-y-8">
                {statusTags.map((tag, index) => {
                    return (
                        <div className="flex items-center justify-start space-x-8" key={index}>
                            {Math.abs(status) > index + 1 ? (
                                <>
                                    <CheckIcon className="h-9 w-9 text-od-500" />
                                    <span className="text-3xl font-medium text-od-500">{tag}</span>
                                </>
                            ) : Math.abs(status) === index + 1 ? (
                                status > 0 ? (
                                    <>
                                        <LoadingAnimation />
                                        <span className="text-3xl font-semibold">{tag}</span>
                                    </>
                                ) : (
                                    <>
                                        <XIcon className="h-9 w-9 text-red-500" />
                                        <span className="text-3xl font-semibold text-red-500">
                                            {tag}
                                        </span>
                                    </>
                                )
                            ) : (
                                <>
                                    <CheckIcon className="h-8 w-8 text-transparent" />
                                    <span className="text-3xl font-medium text-gray-400">
                                        {tag}
                                    </span>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ProgressStatus;
