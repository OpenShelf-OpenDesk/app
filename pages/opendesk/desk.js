import {useEffect, useState} from "react";
import Layout from "../../components/common/Layout";
import LoadingAnimation from "../../components/common/LoadingAnimation";
import PublishedBookCard from "../../components/opendesk/desk/PublishedBookCard";
import {useLoadingContext} from "../../contexts/Loading";
import {useSignerContext} from "../../contexts/Signer";
import {useThemeContext} from "../../contexts/Theme";
import {executeQuery} from "../../utils/apolloClient";
import Image from "next/image";

const Desk = () => {
    const {signer} = useSignerContext();
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const {setTheme} = useThemeContext();
    const {setLoading: setMainLoading} = useLoadingContext();

    useEffect(() => {
        setTheme("od");
        setMainLoading(false);

        return () => {
            setMainLoading(true);
        };
    }, []);

    useEffect(() => {
        const getData = async () => {
            setContributions([]);
            const contributionsData = await executeQuery(`
            query{
                contributorProfile(id:"${signer.address.toLowerCase()}"){
                    contributions(orderBy:share, orderDirection:desc){
                        id
                    }
                }
            }`);
            contributionsData.contributorProfile
                ? setContributions(contributionsData.contributorProfile.contributions)
                : setContributions([]);
            setLoading(false);
            console.log(signer.address.toLowerCase(), contributionsData.contributorProfile);
        };
        getData();
    }, [signer]);

    return (
        <Layout>
            <div className="flex h-full w-full justify-center rounded px-6">
                <div className="relative h-screen w-full rounded bg-od-500/[0.05] p-10">
                    <div
                        className={`absolute inset-0 flex h-full w-full items-center justify-center rounded transition-all duration-300 ease-in-out ${
                            loading ? "opacity-100" : "opacity-0"
                        }`}>
                        <LoadingAnimation />
                    </div>
                    <div
                        className={`z-10 h-full w-full transition duration-500 ease-in-out ${
                            !loading ? "opacity-100" : "opacity-0"
                        }`}>
                        {!loading && (
                            <div className="relative h-full">
                                <div
                                    className={`grid grid-cols-2 gap-10 transition duration-500 ease-in-out ${
                                        contributions.length > 0 ? "opacity-100" : "opacity-0"
                                    }`}>
                                    {contributions.length > 0 &&
                                        contributions.map((contribution, index) => {
                                            return (
                                                <PublishedBookCard
                                                    key={index}
                                                    contributionId={contribution.id}
                                                />
                                            );
                                        })}
                                </div>
                                <div
                                    className={`flex h-full w-full flex-col items-center justify-center transition duration-500 ease-in-out ${
                                        contributions.length > 0 ? "opacity-0" : "opacity-100"
                                    }`}>
                                    <Image
                                        src="/od/blank.svg"
                                        width={300 * 2}
                                        height={200 * 2}
                                        layout="fixed"
                                        className="h-full"
                                        alt="No books in shelf"
                                    />
                                    <div className="mt-10">
                                        <p className="text-xl font-semibold text-gray-700">
                                            Desk is Empty
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Desk;
