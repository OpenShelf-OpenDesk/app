import Image from "next/image";

const PreviewBookCoverPage = ({src, height, width, alt = ""}) => {
    return (
        <div className="relative flex h-full w-full items-center self-start">
            {height && width ? (
                <Image src={src} height={height} width={width} layout="fixed" alt={alt} />
            ) : (
                <Image src={src} layout="fill" objectFit="cover" alt={alt} />
            )}
        </div>
    );
};

export default PreviewBookCoverPage;
