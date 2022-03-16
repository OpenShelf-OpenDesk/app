import Image from "next/image";
import {useEffect, useState} from "react";
import Layout from "../../components/common/Layout";
import HomeBookCard from "../../components/openshelf/HomeBookCard";
import {useThemeContext} from "../../contexts/Theme";
import {useLoadingContext} from "../../contexts/Loading";
import {executeQuery} from "../../utils/apolloClient";

const Home = () => {
    const {theme, setTheme} = useThemeContext();
    const {setLoading} = useLoadingContext();
    const [data, setData] = useState({});

    useEffect(() => {
        setTheme("os");
        const getData = async () => {
            const recentLaunches = await executeQuery(`
            query{
                editions(orderBy:revisedOn, orderDirection:desc, first:15){
                    id
                }
            }`);

            const bestSellers = await executeQuery(`
            query{
                editions(orderBy:pricedBookPrinted, orderDirection:desc, first:15){
                    id
                }
            }`);
            setData({recentLaunches: recentLaunches.editions, bestSellers: bestSellers.editions});
            setLoading(false);
        };
        getData();
        return () => {
            setLoading(true);
        };
    }, []);

    return (
        <Layout title="OpenShelf">
            <div
                className={`group flex h-full w-full items-center justify-center ${
                    theme === "os" ? "bg-os-100" : "bg-od-100"
                } px-3 py-10 lg:py-20 lg:px-32`}>
                <div className="flex flex-col items-center justify-evenly lg:flex-row lg:space-x-20">
                    <Image
                        src="/os/book_reading.svg"
                        width={300 * 1.5}
                        height={200 * 1.5}
                        layout="intrinsic"
                        priority={true}
                        alt="OpenShelf Home Image"
                        className="aspect-[300/200]"
                    />
                    <div className="flex min-h-full flex-1 flex-col content-evenly justify-center space-y-3 text-gray-700 lg:space-y-7 lg:px-10">
                        <p className="text-2xl font-bold lg:text-3xl">
                            Welcome to the realm of digital books
                        </p>
                        <p className="text-base lg:text-lg">
                            Here, you find books not just from the bestselling authors, but from
                            people who have within a writer and dreams to move lives of people.
                        </p>
                    </div>
                </div>
            </div>
            <div className="m-7 overflow-hidden lg:mx-10 lg:my-10">
                <h3 className="text-2xl font-semibold">Best Sellers</h3>
                <div className="relative my-5 flex snap-both space-x-10 overflow-x-scroll">
                    {data.bestSellers &&
                        data.bestSellers.map((book, index) => {
                            return <HomeBookCard key={index} id={book.id} />;
                        })}
                </div>
            </div>
            <div className="m-7 overflow-hidden lg:mx-10 lg:my-10">
                <h3 className="text-2xl font-semibold">Recent Launches</h3>
                <div className="relative my-5 flex snap-both space-x-10 overflow-x-scroll">
                    {data.recentLaunches &&
                        data.recentLaunches.map((book, index) => {
                            return <HomeBookCard key={index} id={book.id} />;
                        })}
                </div>
            </div>
        </Layout>
    );
};

export default Home;
