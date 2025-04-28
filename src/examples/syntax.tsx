import { Syntax } from "@/components/ui/syntax";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

export default function SyntaxExample() {
	const codeExamples = [
		{
			id: "simple-jsx",
			title: "JSX",
			code: `
function HelloWorld() {
    const greeting = "Hello, world!";
    return <h1>{greeting}</h1>;
}
            `.trim(),
		},
		{
			id: "react-hook",
			title: "React Hook",
			code: `
function Counter() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        document.title = \`You clicked \${count} times\`;
    }, [count]);
    
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}
            `.trim(),
		},
		{
			id: "ts-functions",
			title: "TypeScript",
			code: `
interface User {
    name: string;
    age: number;
}

function greetUser(user: User): string {
    return \`Hello, \${user.name}! You are \${user.age} years old.\`;
}

const user = { name: "John", age: 30 };
const message = greetUser(user);
            `.trim(),
		},
	];

	const [selectedId, setSelectedId] = React.useState(codeExamples[0].id);

	return (
		<div className="flex w-full flex-col items-center justify-center gap-2 px-2 sm:gap-4 sm:px-4">
			<div className="w-full max-w-3xl">
				<Tabs
					defaultValue={selectedId}
					onValueChange={setSelectedId}
					className="w-full flex flex-col"
				>
					<div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-2">
						<TabsList className="w-full justify-start overflow-x-auto">
							{codeExamples.map(({ id, title }) => (
								<TabsTrigger key={id} value={id} className="min-w-max">
									{title}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					<div className="relative min-h-[300px] sm:min-h-[400px]">
						<AnimatePresence mode="wait">
							{codeExamples.map(
								(example) =>
									example.id === selectedId && (
										<motion.div
											key={example.id}
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											transition={{
												type: "spring",
												stiffness: 400,
												damping: 30,
												duration: 0.3,
											}}
											className="w-full absolute left-0 right-0"
										>
											<TabsContent
												key={example.id}
												value={example.id}
												className="mt-0 rounded-md border-0 data-[state=active]:block"
												forceMount
											>
												<Syntax maxHeight="calc(100vh - 200px)">
													{example.code}
												</Syntax>
												<div className="mt-2 text-sm text-muted-foreground">
													<p>Example: {example.title}</p>
												</div>
											</TabsContent>
										</motion.div>
									),
							)}
						</AnimatePresence>
					</div>
				</Tabs>
			</div>
		</div>
	);
}
