import React, {useState} from "react";
import Image from "next/image";

const card = () => {
    return (
        <div className="">
            <div className="">
                <Image
                    src="https://picsum.photos/2480/3508/"
                    height={3508 * 0.08}
                    width={2480 * 0.08}
                    alt="image here"
                    className="rounded"
                />
            </div>
            <div className="">
                <h3>description</h3>
            </div>
        </div>
    );
};

export default card;
