import {useRouter} from "next/router";
import NativeBookReader from "../../components/openshelf/NativeBookReader";

const BookReader = () => {
    const router = useRouter();
    const editionAddress = router.query.editionAddress;
    const copyUid = router.query.copyUid;

    return (
        <div>
            <NativeBookReader editionAddress={editionAddress} copyUid={copyUid} />
        </div>
    );
};

export default BookReader;
