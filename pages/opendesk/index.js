import Layout from "../../components/common/Layout";
import Image from "next/image";
import {useThemeContext} from "../../contexts/Theme";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {useLoadingContext} from "../../contexts/Loading";

const Home = () => {
    const {theme, setTheme} = useThemeContext();
    const {setLoading} = useLoadingContext();

    const router = useRouter();

    useEffect(() => {
        setTheme("od");
        setLoading(false);

        return () => {
            setLoading(true);
        };
    }, []);

    return (
        <Layout>
            <div
                className={`group z-0 flex h-full w-full items-center justify-center ${
                    theme === "os" ? "bg-os-100" : "bg-od-100"
                } px-3 py-10 lg:py-20 lg:px-32`}>
                <div className="flex flex-col items-center justify-evenly lg:flex-row lg:space-x-20">
                    <Image
                        src="/od/winter.svg"
                        width={300 * 1.5}
                        height={200 * 1.5}
                        layout="intrinsic"
                        priority={true}
                        alt="OpenDesk Home Image"
                        className="aspect-[300/200]"
                    />
                    <div className="flex min-h-full flex-1 flex-col content-evenly justify-center space-y-3 px-5 text-gray-700 lg:space-y-7 ">
                        <p className="text-2xl font-bold lg:text-3xl">
                            Welcome to the realm of digital books
                        </p>
                        <p className="text-base lg:text-lg">
                            Here, you find books not just from the bestselling authors, but from
                            people who have within a writer and dreams to move lives of people.
                        </p>
                        <div className="flex space-x-5 pt-2">
                            <button
                                className="button-od w-1/5"
                                onClick={() => {
                                    setLoading(true);
                                    router.push("/opendesk/publish");
                                }}>
                                <p className="lg:text-base">Publish</p>
                            </button>
                            <button
                                className="button-od w-1/4"
                                onClick={() => {
                                    setLoading(true);
                                    router.push("/opendesk/createSeries");
                                }}>
                                <p className="lg:text-base">Create Series</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="m-7 lg:mx-10 lg:my-10">
                <h3 className="text-xl font-bold lg:text-2xl">Total Statistics</h3>
                <div className="my-5 flex overflow-scroll overscroll-x-contain">
                    {/* {recentBooks.map((book, index) => {
                            return <BookCard key={index} book_metadata_uri={book} />;
                        })} */}
                </div>
            </div>
        </Layout>
    );
};

export default Home;
