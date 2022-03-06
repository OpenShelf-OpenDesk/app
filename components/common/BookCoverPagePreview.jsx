import Image from "next/image";

const PreviewBookCoverPage = ({src, height, width}) => {
    return (
        <div className="relative flex h-full w-full items-center self-start">
            {height && width ? (
                <Image src={src} height={height} width={width} layout="fixed" />
            ) : (
                <Image src={src} layout="fill" objectFit="cover" />
            )}
        </div>
    );
};

export default PreviewBookCoverPage;
