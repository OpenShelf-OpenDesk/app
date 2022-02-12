import Head from "next/head";
import Image from "next/image";
import {useState} from "react";

export default function Home() {
	const [req, setReq] = useState(false);
	return (
		<div>
			<Head>
				<title>OpenShelf | OpenDesk</title>
				<meta
					name="description"
					content="A NFT MarketPlace for censorship-resistant authorship."
				/>
				{/* <link rel="icon" href="/favicon.ico" /> */}
			</Head>
			<form
				className=" form-control mx-auto flex max-w-sm flex-col justify-center space-y-10 py-16 accent-os-500"
				onSubmit={e => {
					e.preventDefault();
					setReq(true);
				}}>
				<div className="flex flex-col space-y-2">
					<div className="flex flex-col-reverse">
						<input
							name="textField1"
							type="text"
							placeholder="Type Something here ..."
							className="input-text peer"
							autoComplete="off"
							required={req}
						/>
						<span className="peer-input-text">{"|"}</span>
					</div>
					<div className="flex flex-col-reverse">
						<input
							name="textField1"
							type="text"
							placeholder="Type Something here ..."
							className="input-text  peer"
							autoComplete="off"
						/>
						<span className="peer-input-text">{"|"}</span>
					</div>
					<div className="flex flex-col-reverse">
						<input
							name="textField1"
							type="email"
							placeholder="Type Something here ..."
							className="input-text peer"
							autoComplete="off"
						/>
						<span className="peer-input-text">{"|"}</span>
					</div>
					<div className="flex flex-col-reverse">
						<input
							name="textField1"
							type="email"
							placeholder="Type Something here ..."
							className="input-text peer"
							autoComplete="off"
							required={req}
						/>
						<span className="peer-input-text">{"|"}</span>
					</div>
				</div>
				<div className="flex items-center space-x-2">
					<input id="abc" name="checkbox1" type="checkbox" className="text-lg" />
					<label htmlFor="abc">sacac</label>
				</div>
				<button className="button-od" type="Submit">
					OpenDesk
				</button>
				<button className="button-os">OpenShelf</button>
			</form>
		</div>
	);
}
