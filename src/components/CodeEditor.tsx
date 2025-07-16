import { useEffect, useState, useRef } from "preact/hooks";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import "./CodeEditor.css";

interface CodeEditorProps {
	initialCode?: string;
}

export default function CodeEditor({ initialCode = "" }: CodeEditorProps) {
	const [code, setCode] = useState(initialCode);
	const [display, setDisplay] = useState("");
	const [isRunning, setIsRunning] = useState(false);
	const editorRef = useRef<HTMLDivElement>(null);
	const editorViewRef = useRef<EditorView | null>(null);

	// Update code state when initialCode prop changes
	useEffect(() => {
		setCode(initialCode);
	}, [initialCode]);

	useEffect(() => {
		if (editorRef.current && !editorViewRef.current) {
			// Create CodeMirror editor instance
			editorViewRef.current = new EditorView({
				doc: initialCode,
				extensions: [
					basicSetup,
					javascript(),
					oneDark,
					EditorView.updateListener.of((update) => {
						if (update.docChanged) {
							setCode(update.state.doc.toString());
						}
					})
				],
				parent: editorRef.current
			});
		}

		// Cleanup function
		return () => {
			if (editorViewRef.current) {
				editorViewRef.current.destroy();
				editorViewRef.current = null;
			}
		};
	}, []);

	// Update editor content when initialCode changes
	useEffect(() => {
		if (editorViewRef.current && initialCode !== code) {
			const currentContent = editorViewRef.current.state.doc.toString();
			if (currentContent !== initialCode) {
				editorViewRef.current.dispatch({
					changes: {
						from: 0,
						to: currentContent.length,
						insert: initialCode
					}
				});
			}
		}
	}, [initialCode]);

	const runCode = () => {
		setIsRunning(true);
		try {
			// Only evaluate if there's actual code
			if (code.trim()) {
				// Capture console.log and console.assert output
				const originalLog = console.log;
				const originalAssert = console.assert;
				const logs: any[] = [];
				const assertions: any[] = [];

				console.log = (...args) => {
					logs.push(...args);
					originalLog(...args);
				};

				console.assert = (condition: boolean, ...args: any[]) => {
					if (!condition) {
						const message = args.length > 0 ? args.join(' ') : 'Assertion failed';
						assertions.push(`❌ Assertion failed: ${message}`);
						originalAssert(condition, ...args);
					}
				};

				// Evaluate the code
				const result = eval(code);

				// Restore original console methods
				console.log = originalLog;
				console.assert = originalAssert;

				// Build display output
				let output = "";

				// Add console.log output if any
				if (logs.length > 0) {
					output += logs.map(log =>
						typeof log === 'object' ? JSON.stringify(log, null, 2) : String(log)
					).join('\n') + '\n';
				}

				// Add assertion failures if any
				if (assertions.length > 0) {
					if (output) output += '\n';
					output += assertions.join('\n') + '\n';
				}

				// Add the result if it's not undefined
				if (result !== undefined) {
					if (output) output += '\n';
					output += typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
				}

				setDisplay(output || "Code executed successfully");
			} else {
				setDisplay("No code to run");
			}
		} catch (e) {
			if (e instanceof Error) {
				setDisplay(`Error: ${e.message}`);
			}
		} finally {
			setIsRunning(false);
		}
	};

	// Handle Ctrl+Enter or Cmd+Enter to run code
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
				e.preventDefault();
				runCode();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [code]);

	return (
		<div className="code-editor-wrapper">
			<div id="container">
				<div id="editor">
					<button
						id="run-button"
						onClick={runCode}
						disabled={isRunning}
					>
						{isRunning ? 'Running...' : 'Run Code'}
					</button>
					<div ref={editorRef}></div>
				</div>
				<div id="result-container">
					<h2>Output</h2>
					<div id="result">
						{display}
					</div>
				</div>
			</div>
		</div>
	);
}
