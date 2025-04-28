import * as ScrollArea from "@radix-ui/react-scroll-area";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

// Necesitarás instalar estas dependencias:
// npm install acorn acorn-jsx acorn-typescript

const tokenColors = {
	keyword: "text-primary",
	string: "text-chart-1",
	function: "text-chart-2",
	variable: "text-foreground",
	jsxTag: "text-destructive",
	punctuation: "text-muted-foreground",
	comment: "text-muted-foreground",
	number: "text-chart-3",
	operator: "text-accent",
};

// Lista de palabras clave
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

interface SyntaxProps {
	children: ReactNode;
}

interface Token {
	value: string;
	type: string;
	start: number;
	end: number;
	line: number;
}

export const Syntax = ({ children }: SyntaxProps) => {
	const [lines, setLines] = useState<Token[][]>([]);
	const [parseError, setParseError] = useState<string | null>(null);

	// Convert children to string
	const code = children?.toString() || "";

	useEffect(() => {
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
					{
						regex: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g,
						type: "number",
					},
					{
						regex: /<\/?[A-Z][a-zA-Z0-9]*/g,
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

				// Función para procesar cada paso de tokenización
				const processTokenizationStep = (regex: RegExp, tokenType: string) => {
					let match = regex.exec(code);
					while (match !== null) {
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
				for (const { regex, type } of tokenizationOrder) {
					processTokenizationStep(regex, type);
				}

				// Debug: Verificar que los tokens tienen los tipos correctos
				console.log("Generated tokens:", tokens.slice(0, 10));

				// Ordenamos los tokens por posición
				tokens.sort((a, b) => a.start - b.start);

				// Dividimos los tokens en líneas
				const codeLines = code.split("\n");
				const lineGroups: Token[][] = Array(codeLines.length)
					.fill(0)
					.map(() => []);

				for (const token of tokens) {
					const lineNumber = token.line - 1;
					if (lineNumber >= 0 && lineNumber < lineGroups.length) {
						lineGroups[lineNumber].push(token);
					}
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
	}, [code]);

	// Si no hay líneas procesadas, mostramos texto plano
	if (lines.length === 0) {
		const codeLines = code.split("\n");
		return (
			<ScrollArea.Root className="rounded-md border bg-card">
				<ScrollArea.Viewport className="max-h-[500px] p-4">
					<pre className="font-mono text-sm">
						{codeLines.map((line, lineIndex) => (
							<div key={`line-${lineIndex}-${line}`} className="flex">
								<span className="mr-4 w-8 select-none text-muted-foreground">
									{lineIndex + 1}
								</span>
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

	return (
		<ScrollArea.Root className="rounded-md border bg-card">
			{parseError && (
				<div className="p-2 text-xs text-destructive border-b bg-destructive/10">
					Error: {parseError}
				</div>
			)}
			<ScrollArea.Viewport className="max-h-[500px] p-4">
				<pre className="font-mono text-sm">
					{lines.map((lineTokens: Token[], lineIndex: number) => (
						<div
							key={`line-${lineIndex}-${lineTokens.map((t) => t.value).join("")}`}
							className="flex"
						>
							<span className="mr-4 w-8 select-none text-muted-foreground">
								{lineIndex + 1}
							</span>
							<div className="flex-1">
								{lineTokens.length > 0 ? (
									<>
										{lineTokens.map((token: Token) => {
											// Fix: Asegurarnos que usamos solo className o solo style
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
		</ScrollArea.Root>
	);
};
