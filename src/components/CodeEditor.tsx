import { useEffect, useState } from "preact/hooks";
import "./CodeEditor.css";

export default function CodeEditor({ initialCode = "" }) {
	const [code, setCode] = useState(initialCode);
	const [display, setDisplay] = useState("");

	const handleChange = (e: any) => {
		setCode(e.currentTarget.value);

	};

	useEffect(() => {
		try {
			const result = eval(code);
			setDisplay(result);
		} catch (e) {
			if (e instanceof Error) {
				setDisplay(e.message);
			}
		}
	}, [code])
	return (
		<div id="container">
			<div id="editor">
				<h2>Type some code in here</h2>
				<textarea id="code" value={code} onKeyUp={handleChange}></textarea>
			</div>
			<div id="result-container">
				<h2>See it evaluate here</h2>
				<div id="result">
					{display}
				</div>
			</div>
		</div>
	);
}
