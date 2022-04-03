import {useRouter} from "next/router";
import {useEffect} from "react";
import {useLoadingContext} from "../contexts/Loading";

const Index = () => {
    const {setLoading} = useLoadingContext();
    const router = useRouter();
    useEffect(() => {
        router.push(`/openshelf`);
        return () => {
            setLoading(true);
        };
    }, []);

    return <></>;
};

export default Index;
