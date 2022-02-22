import Layout from "../../components/Layout";
import Image from "next/image";
import {useThemeContext} from "../../contexts/Theme";
import {useEffect} from "react";
import {useRouter} from "next/router";

const Home = () => {
    const {theme, setTheme} = useThemeContext();
    const router = useRouter();

    useEffect(() => {
        setTheme("od");
    }, []);

    return (
        <Layout>
            <div
                className={`group z-0 flex h-full w-full items-center justify-center ${
                    theme === "os" ? "bg-os-100" : "bg-od-100"
                } px-3 py-10 lg:p-20`}>
                <div className="flex flex-col items-center justify-evenly space-y-10 lg:flex-row lg:space-x-16">
                    <Image
                        src="/undraw_notebook_re_id0r.svg"
                        width={300 * 2}
                        height={200 * 2}
                        layout="intrinsic"
                        priority={true}
                        alt="OpenDesk Home Image"
                        className="aspect-[300/200]"
                    />
                    <div className="flex min-h-full flex-1 flex-col content-evenly justify-center space-y-3 px-5 text-gray-700 lg:space-y-7 lg:px-10">
                        <p className="text-2xl font-bold lg:text-3xl">
                            Welcome to the realm of digital books
                        </p>
                        <p className="text-base lg:text-lg">
                            Here, you find books not just from the bestselling authors, but from
                            people who have within a writer and dreams to move lives of people.
                            Here, you find books not just from the bestselling authors, but from
                            people who have within a writer and dreams to move lives of people.
                        </p>
                        <div className="pt-2">
                            <button
                                className="button-od w-3/5 lg:w-1/5"
                                onClick={() => {
                                    router.push("/opendesk/publish");
                                }}>
                                <p className="lg:text-base">Publish</p>
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
