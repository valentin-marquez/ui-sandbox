import { Button } from "@/components/ui/button";
import { Syntax } from "@/components/ui/syntax";
import * as React from "react";

export default function SyntaxExample() {
	const codeExamples = [
		{
			id: "simple-jsx",
			title: "Simple JSX Component",
			code: `
function HelloWorld() {
    const greeting = "Hello, world!";
    return <h1>{greeting}</h1>;
}
            `.trim(),
		},
		{
			id: "react-hook",
			title: "React Hook Example",
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
			title: "TypeScript Functions",
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

	const [selectedExample, setSelectedExample] = React.useState(
		codeExamples[0].id,
	);

	return (
		<div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-6">
			<div className="flex flex-wrap gap-2">
				{codeExamples.map(({ id, title }) => (
					<Button
						key={id}
						variant={selectedExample === id ? "default" : "outline"}
						onClick={() => setSelectedExample(id)}
					>
						{title}
					</Button>
				))}
			</div>

			<div className="w-full max-w-3xl">
				<Syntax>
					{codeExamples.find((ex) => ex.id === selectedExample)?.code || ""}
				</Syntax>
			</div>
		</div>
	);
}
