import {useEffect} from "react";
import Layout from "../../components/common/Layout";
import Tabs from "../../components/common/Tabs";
import DistributedBooks from "../../components/openshelf/shelf/DistributedBooks";
import OwnedBooks from "../../components/openshelf/shelf/OwnedBooks";
import RentedBooks from "../../components/openshelf/shelf/RentedBooks";
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
                            <OwnedBooks key={1} />,
                            <RentedBooks key={2} />,
                            <DistributedBooks key={3} />
                        ]}
                    />
                </div>
            </section>
        </Layout>
    );
};

export default Shelf;
