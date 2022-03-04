import {useEffect} from "react";
import Layout from "../../components/common/Layout";
import Tabs from "../../components/common/Tabs";
import {useLoadingContext} from "../../contexts/Loading";
import {useThemeContext} from "../../contexts/Theme";

const Shelf = () => {
    const {setTheme} = useThemeContext();
    const {setLoading} = useLoadingContext();
    useEffect(() => {
        setTheme("os");
        setLoading(false);

        return () => {
            setLoading(true);
        };
    }, []);

    return (
        <Layout>
            <section className="h-full w-full px-6">
                <div className="flex w-full justify-center">
                    <Tabs
                        tabs={["Owned", "Rented", "Distributed"]}
                        panels={[
                            <div className="h-screen w-full rounded bg-os-500/[0.05] p-10">
                                Owned Books
                            </div>,
                            <div className="h-screen w-full rounded bg-os-500/[0.05] p-10">
                                Rented Books
                            </div>,
                            <div className="h-screen w-full rounded bg-os-500/[0.05] p-10">
                                Distributed Books
                            </div>
                        ]}
                    />
                </div>
            </section>
        </Layout>
    );
};

export default Shelf;
