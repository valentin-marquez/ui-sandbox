import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Tabs from "@radix-ui/react-tabs";
import * as Tooltip from "@radix-ui/react-tooltip";
import type { Token } from "acorn";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, FileCode } from "lucide-react";
import type { ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { Button } from "./button";

// Context for managing shared state between SyntaxContainer and Syntax
interface SyntaxContextValue {
	activeTab: string;
	setActiveTab: (value: string) => void;
	registerTab: (id: string, filename: string) => void;
	tabs: Array<{ id: string; filename: string }>;
}

const SyntaxContext = createContext<SyntaxContextValue | null>(null);

export const useSyntaxContext = () => {
	const context = useContext(SyntaxContext);
	if (!context) {
		throw new Error("Syntax components must be used within a SyntaxContainer");
	}
	return context;
};

// Existing color definitions and keywords
const tokenColors = {
	keyword: "text-primary ",
	string: "text-chart-1",
	function: "text-chart-2 ",
	variable: "text-foreground",
	jsxTag: "text-chart-3 ",
	punctuation: "text-muted-foreground",
	comment: "text-muted-foreground italic",
	number: "text-chart-4",
	operator: "text-chart-5",
	whitespace: "",
	arrowFunction: "text-primary ",
	assignment: "text-chart-5",
	parameter: "text-accent-foreground",
	property: "text-chart-2/90",
	// Type-specific tokens (TypeScript)
	type: "text-chart-4 ",
	interface: "text-chart-3 ",
};

// List of keywords
const keywords = [
	"await",
	"break",
	"case",
	"catch",
	"class",
	"const",
	"continue",
	"debugger",
	"default",
	"delete",
	"do",
	"else",
	"enum",
	"export",
	"extends",
	"false",
	"finally",
	"for",
	"function",
	"if",
	"import",
	"in",
	"instanceof",
	"new",
	"null",
	"return",
	"super",
	"switch",
	"this",
	"throw",
	"true",
	"try",
	"typeof",
	"var",
	"void",
	"while",
	"with",
	"yield",
	"let",
	"static",
	"interface",
	"package",
	"private",
	"protected",
	"public",
	"implements",
	"yield",
	"as",
	"async",
	"from",
];

// New container component for multiple syntax tabs
interface SyntaxContainerProps {
	children: ReactNode;
	defaultTab?: string;
	maxHeight?: string;
}

export const SyntaxContainer = ({
	children,
	defaultTab,
	maxHeight = "500px",
}: SyntaxContainerProps) => {
	const [activeTab, setActiveTab] = useState<string>("");
	const [tabs, setTabs] = useState<Array<{ id: string; filename: string }>>([]);
	const [initialTabSet, setInitialTabSet] = useState(false);

	const registerTab = useCallback((id: string, filename: string) => {
		setTabs((prevTabs) => {
			const exists = prevTabs.some((tab) => tab.id === id);
			if (exists) return prevTabs;
			return [...prevTabs, { id, filename }];
		});

		// Don't set the active tab here anymore
	}, []);

	// Modified useEffect to only set default tab once during initialization
	useEffect(() => {
		if (!initialTabSet && tabs.length > 0) {
			if (defaultTab && tabs.some((tab) => tab.id === defaultTab)) {
				setActiveTab(defaultTab);
			} else {
				setActiveTab(tabs[0].id);
			}
			setInitialTabSet(true);
		}
	}, [tabs, defaultTab, initialTabSet]);

	return (
		<SyntaxContext.Provider
			value={{ activeTab, setActiveTab, registerTab, tabs }}
		>
			<div className="rounded-md border bg-card shadow-sm">
				<Tabs.Root
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full"
				>
					<Tabs.List className="flex border-b bg-muted/40 px-2">
						{tabs.map((tab) => (
							<Tabs.Trigger
								key={tab.id}
								value={tab.id}
								className="flex items-center gap-1.5 px-3 py-2 text-sm outline-none transition-all hover:bg-muted/60 data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:font-medium"
							>
								<FileCode size={14} />
								{tab.filename}
							</Tabs.Trigger>
						))}
					</Tabs.List>
					{children}
				</Tabs.Root>
			</div>
		</SyntaxContext.Provider>
	);
};

// Modified syntax component to work with or without container
interface SyntaxProps {
	children: ReactNode;
	showLineNumbers?: boolean;
	maxHeight?: string;
	filename?: string;
	id?: string;
}

export const Syntax = ({
	children,
	showLineNumbers = true,
	maxHeight = "500px",
	filename,
	id,
}: SyntaxProps) => {
	const syntaxContext = useContext(SyntaxContext);
	const isStandalone = !syntaxContext;
	const uniqueId = id || filename || Math.random().toString(36).substring(2, 9);

	const [lines, setLines] = useState<Token[][]>([]);
	const [parseError, setParseError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [isHovering, setIsHovering] = useState(false);

	// Register with parent container if available
	useEffect(() => {
		if (syntaxContext && filename) {
			syntaxContext.registerTab(uniqueId, filename);
		}
	}, [syntaxContext, uniqueId, filename]);

	// Check if this tab is active or if it's a standalone component
	const isVisible =
		isStandalone || (syntaxContext && syntaxContext.activeTab === uniqueId);

	// Convert children to string
	const code = children?.toString() || "";

	const copyToClipboard = useCallback(() => {
		if (navigator.clipboard && code) {
			navigator.clipboard
				.writeText(code)
				.then(() => {
					setCopied(true);
					setTimeout(() => setCopied(false), 2000);
				})
				.catch((err) => console.error("Failed to copy:", err));
		}
	}, [code]);

	useEffect(() => {
		// Only parse code if this tab is visible or it's a standalone component
		if (!isVisible) return;

		const loadAcorn = async () => {
			try {
				// Importamos dinámicamente para asegurar que exista en el entorno del navegador
				const acorn = await import("acorn");
				const jsx = await import("acorn-jsx");

				// Fix: No usaremos acorn-typescript debido a problemas de compatibilidad
				// Simplemente usamos acorn con el plugin jsx
				const Parser = acorn.Parser.extend(
					jsx.default({ allowNamespaces: true }),
				);

				try {
					// Parseamos el código - pero esto es opcional,
					// ya que nuestro sistema de tokenización usa principalmente RegEx
					Parser.parse(code, {
						ecmaVersion: "latest",
						sourceType: "module",
						locations: true,
						ranges: true,
					});
				} catch (parseError) {
					console.warn("Parse warning (non-fatal):", parseError);
					// Continuamos con la tokenización aunque falle el parser
					// porque nuestro sistema de tokens se basa en RegEx
				}

				// Extraemos tokens manualmente - Acorn no tiene API directa para tokens
				const tokens: Token[] = [];

				// Estructura de tokenización ordenada
				const tokenizationOrder = [
					{
						regex: /(["'`])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/g,
						type: "string",
					},
					{
						regex: /\/\/.*?(?:\n|$)|\/\*[\s\S]*?\*\//g,
						type: "comment",
					},
					// Add TypeScript interface detection (before variable detection)
					{
						regex: /\b(interface|type)\s+([A-Za-z_][A-Za-z0-9_]*)/g,
						type: "interface",
						processFn: (match: RegExpExecArray, tokens: Token[]) => {
							// Match the keyword "interface" or "type"
							const keyword = match[1];
							const interfaceName = match[2];
							const start = match.index;
							const keywordEnd = start + keyword.length;
							const nameStart =
								match[0].indexOf(interfaceName, keyword.length) + start;
							const nameEnd = nameStart + interfaceName.length;

							const codeBeforeMatch = code.substring(0, start);
							const line = (codeBeforeMatch.match(/\n/g) || []).length + 1;

							// Add the keyword token
							tokens.push({
								value: keyword,
								type: "keyword",
								start: start,
								end: keywordEnd,
								line,
							});

							// Add whitespace token
							if (nameStart > keywordEnd) {
								tokens.push({
									value: match[0].substring(
										keyword.length,
										match[0].indexOf(interfaceName, keyword.length),
									),
									type: "whitespace",
									start: keywordEnd,
									end: nameStart,
									line,
								});
							}

							// Add the interface name token
							tokens.push({
								value: interfaceName,
								type: "interface",
								start: nameStart,
								end: nameEnd,
								line,
							});

							return true; // We handled this match manually
						},
					},
					// Add TypeScript type annotation detection
					{
						regex: /:\s*([A-Za-z_][A-Za-z0-9_<>[\]{}|&,\s]*)\b/g,
						type: "type",
						processFn: (match: RegExpExecArray, tokens: Token[]) => {
							const colonPos = match.index;
							const typeStart = match.index + match[0].indexOf(match[1], 1);
							const typeEnd = typeStart + match[1].length;

							const codeBeforeMatch = code.substring(0, colonPos);
							const line = (codeBeforeMatch.match(/\n/g) || []).length + 1;

							// Add the colon token
							tokens.push({
								value: ":",
								type: "punctuation",
								start: colonPos,
								end: colonPos + 1,
								line,
							});

							// Add whitespace if any
							if (typeStart > colonPos + 1) {
								tokens.push({
									value: match[0].substring(1, match[0].indexOf(match[1], 1)),
									type: "whitespace",
									start: colonPos + 1,
									end: typeStart,
									line,
								});
							}

							// Add the type token
							tokens.push({
								value: match[1],
								type: "type",
								start: typeStart,
								end: typeEnd,
								line,
							});

							return true; // We handled this match manually
						},
					},
					{
						regex: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g,
						type: "number",
					},
					{
						regex: /<\/?[A-Za-z][a-zA-Z0-9]*(?:\s|\/?>|$)/g, // Improved JSX tag detection
						type: "jsxTag",
					},
					{
						regex: new RegExp(`\\b(${keywords.join("|")})\\b`, "g"),
						type: "keyword",
					},
					{
						regex: /[{}[\]();,.:]/g,
						type: "punctuation",
					},
					{
						regex: /[+\-*/%=&|^~<>!?]+/g,
						type: "operator",
					},
					{
						regex: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g,
						type: "function",
					},
					{
						regex: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g,
						type: "variable",
					},
				];

				// Update the processing function to handle custom processors
				const processTokenizationStep = (
					regex: RegExp,
					tokenType: string,
					processFn?: (match: RegExpExecArray, tokens: Token[]) => boolean,
				) => {
					let match = regex.exec(code);
					while (match !== null) {
						// If there's a custom processor, use it
						if (processFn) {
							const processed = processFn(match, tokens);
							if (processed) {
								match = regex.exec(code);
								continue;
							}
						}

						// Standard token processing
						const value = match[0];
						const start = match.index;
						const end = start + value.length;

						const codeBeforeMatch = code.substring(0, start);
						const line = (codeBeforeMatch.match(/\n/g) || []).length + 1;

						// Verificar que no esté dentro de un token ya definido
						const overlapping = tokens.some(
							(token) =>
								(start >= token.start && start < token.end) ||
								(end > token.start && end <= token.end),
						);

						if (!overlapping) {
							tokens.push({
								value,
								type: tokenType,
								start,
								end,
								line,
							});
						}

						match = regex.exec(code);
					}
				};

				// Aplicar cada paso de tokenización
				for (const { regex, type, processFn } of tokenizationOrder) {
					processTokenizationStep(regex, type, processFn);
				}

				// Add whitespace and unrecognized characters as tokens
				// This is crucial for preserving spacing
				const processedRanges: [number, number][] = tokens.map((t) => [
					t.start,
					t.end,
				]);
				processedRanges.sort((a, b) => a[0] - b[0]);

				let lastEnd = 0;
				const gaps: [number, number][] = [];

				// Find gaps between tokens
				for (const [start, end] of processedRanges) {
					if (start > lastEnd) {
						gaps.push([lastEnd, start]);
					}
					lastEnd = Math.max(lastEnd, end);
				}

				// Add the final gap if needed
				if (lastEnd < code.length) {
					gaps.push([lastEnd, code.length]);
				}

				// Create whitespace tokens for the gaps
				for (const [start, end] of gaps) {
					const value = code.substring(start, end);
					const codeBeforeMatch = code.substring(0, start);
					const line = (codeBeforeMatch.match(/\n/g) || []).length + 1;

					tokens.push({
						value,
						type: "whitespace",
						start,
						end,
						line,
					});
				}

				// Ordenamos los tokens por posición
				tokens.sort((a, b) => a.start - b.start);

				// Get the total number of lines in the code
				const totalLines = code.split("\n").length;

				// Create an array to hold tokens for each line
				const lineGroups: Token[][] = Array(totalLines)
					.fill(0)
					.map(() => []);

				// Process each token to place it in the correct line
				for (const token of tokens) {
					// Check if the token contains line breaks
					if (token.value.includes("\n")) {
						// Split the token by line breaks
						const lines = token.value.split("\n");
						let currentLine = token.line;
						let currentPos = token.start;

						// Process each line segment
						for (let i = 0; i < lines.length; i++) {
							const lineContent = lines[i];
							if (lineContent.length > 0) {
								lineGroups[currentLine - 1].push({
									value:
										i < lines.length - 1 ? `${lineContent}\n` : lineContent,
									type: token.type,
									start: currentPos,
									end:
										currentPos +
										lineContent.length +
										(i < lines.length - 1 ? 1 : 0),
									line: currentLine,
								});
							} else if (i < lines.length - 1) {
								// Add an empty line token for line breaks
								lineGroups[currentLine - 1].push({
									value: "\n",
									type: "whitespace",
									start: currentPos,
									end: currentPos + 1,
									line: currentLine,
								});
							}

							if (i < lines.length - 1) {
								currentPos += lineContent.length + 1; // +1 for the '\n'
								currentLine++;
							}
						}
					} else {
						// If no line breaks, just add the token to its line
						if (token.line > 0 && token.line <= lineGroups.length) {
							lineGroups[token.line - 1].push(token);
						}
					}
				}

				// Ensure empty lines have at least one token
				for (let i = 0; i < lineGroups.length; i++) {
					if (lineGroups[i].length === 0) {
						lineGroups[i].push({
							value: "",
							type: "whitespace",
							start: 0,
							end: 0,
							line: i + 1,
						});
					}
				}

				// Sort tokens within each line by their start position
				for (let i = 0; i < lineGroups.length; i++) {
					lineGroups[i].sort((a, b) => a.start - b.start);
				}

				setLines(lineGroups);
				setParseError(null);
			} catch (error) {
				console.error("Error parsing code:", error);
				setParseError(String(error));

				// Fallback: mostramos el código sin resaltado
				const codeLines = code.split("\n");
				const fallbackLines = codeLines.map((line, idx) => [
					{
						value: line,
						type: "variable",
						start: 0,
						end: line.length,
						line: idx + 1,
					},
				]);

				setLines(fallbackLines);
			}
		};

		loadAcorn();
	}, [code, isVisible]);

	// If this tab is not active and it's part of a container, don't render it
	if (!isVisible) {
		return null;
	}

	// Si no hay líneas procesadas, mostramos texto plano
	if (lines.length === 0) {
		const codeLines = code.split("\n");
		return (
			<ScrollArea.Root
				className={isStandalone ? "rounded-md border bg-card" : ""}
			>
				<ScrollArea.Viewport
					className="p-4"
					style={{ maxHeight: isStandalone ? maxHeight : undefined }}
				>
					<pre className="font-mono text-sm relative">
						{codeLines.map((line, lineIndex) => (
							<div key={`line-${lineIndex}-${line}`} className="flex">
								{showLineNumbers && (
									<span className="mr-4 w-8 select-none text-muted-foreground">
										{lineIndex + 1}
									</span>
								)}
								<div className="flex-1">{line}</div>
							</div>
						))}
					</pre>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar orientation="vertical">
					<ScrollArea.Thumb className="rounded-full bg-border" />
				</ScrollArea.Scrollbar>
			</ScrollArea.Root>
		);
	}

	const syntaxContent = (
		<Tooltip.Provider>
			<div
				className="relative"
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
			>
				<ScrollArea.Root
					className={
						isStandalone
							? "rounded-md border bg-card shadow-sm transition-all duration-200"
							: ""
					}
				>
					{parseError && (
						<div className="border-b bg-destructive/10 p-2 text-destructive text-xs">
							Error: {parseError}
						</div>
					)}
					<ScrollArea.Viewport
						className="p-4"
						style={{ maxHeight: isStandalone ? maxHeight : undefined }}
					>
						<pre className="font-mono text-sm">
							{lines.map((lineTokens: Token[], lineIndex: number) => (
								<div
									key={`line-${lineIndex}-${lineTokens.map((t) => t.value).join("")}`}
									className="flex"
								>
									{showLineNumbers && (
										<span className="mr-4 w-8 select-none text-muted-foreground">
											{lineIndex + 1}
										</span>
									)}
									<div className="flex-1">
										{lineTokens.length > 0 ? (
											<>
												{lineTokens.map((token: Token) => {
													const colorClass =
														tokenColors[token.type as keyof typeof tokenColors];
													return (
														<span
															key={`token-${lineIndex}-${token.start}-${token.end}`}
															className={colorClass || "text-foreground"}
														>
															{token.value}
														</span>
													);
												})}
											</>
										) : (
											// Empty line
											<span>&nbsp;</span>
										)}
									</div>
								</div>
							))}
						</pre>
					</ScrollArea.Viewport>
					<ScrollArea.Scrollbar orientation="vertical">
						<ScrollArea.Thumb className="rounded-full bg-border" />
					</ScrollArea.Scrollbar>

					<AnimatePresence>
						{isHovering && (
							<motion.div
								className="absolute top-2 right-2"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								transition={{ type: "spring", stiffness: 300, damping: 25 }}
							>
								<Tooltip.Root open={copied}>
									<Tooltip.Trigger asChild>
										<Button
											size="icon"
											variant="ghost"
											className="h-8 w-8 bg-background/80 backdrop-blur-sm"
											onClick={copyToClipboard}
										>
											{copied ? <Check size={16} /> : <Copy size={16} />}
										</Button>
									</Tooltip.Trigger>
									<Tooltip.Portal>
										<Tooltip.Content
											className="rounded-md bg-popover px-3 py-1.5 text-popover-foreground text-sm shadow-md"
											side="left"
											sideOffset={5}
										>
											{copied ? "Copied!" : "Copy code"}
											<Tooltip.Arrow className="fill-popover" />
										</Tooltip.Content>
									</Tooltip.Portal>
								</Tooltip.Root>
							</motion.div>
						)}
					</AnimatePresence>
				</ScrollArea.Root>
			</div>
		</Tooltip.Provider>
	);

	return isStandalone ? (
		syntaxContent
	) : (
		<Tabs.Content value={uniqueId}>{syntaxContent}</Tabs.Content>
	);
};
