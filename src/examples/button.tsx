import { Button } from "@/components/ui/button";
import { ExternalLink, Send } from "lucide-react";
import * as React from "react";

export default function ButtonExample() {
	const buttonConfigs = [
		{
			id: "top",
			label: "Default Loader",
			variant: "default" as const,
			iconConfig: { side: "top" as const },
			icon: null,
			isLink: false,
		},
		{
			id: "bottom",
			label: "Bottom Loader",
			variant: "default" as const,
			iconConfig: { side: "bottom" as const },
			icon: null,
			isLink: false,
		},
		{
			id: "send",
			label: "Send Message",
			variant: "secondary" as const,
			iconConfig: { side: "bottom" as const },
			icon: <Send className="text-primary" />,
			isLink: false,
		},
		{
			id: "link",
			label: "Visit Website",
			variant: "outline" as const,
			iconConfig: { side: "top" as const },
			icon: <ExternalLink className="h-4 w-4" />,
			isLink: true,
			href: "https://example.com",
		},
	];

	const [loadingStates, setLoadingStates] = React.useState(
		Object.fromEntries(buttonConfigs.map(({ id }) => [id, false])),
	);

	const handleClick = (id: string) => {
		setLoadingStates((prev) => ({ ...prev, [id]: true }));
		setTimeout(() => {
			setLoadingStates((prev) => ({ ...prev, [id]: false }));
		}, 2000);
	};

	return (
		<div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-4">
			{buttonConfigs.map(
				({ id, label, variant, iconConfig, icon, isLink, href }) =>
					isLink ? (
						<Button
							key={id}
							variant={variant}
							icon={icon}
							iconConfig={iconConfig}
							asChild
						>
							<a
								key={id}
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-block no-underline"
							>
								{label}
							</a>
						</Button>
					) : (
						<Button
							key={id}
							variant={variant}
							onClick={() => handleClick(id)}
							showIcon={loadingStates[id]}
							icon={icon}
							disabled={loadingStates[id]}
							iconConfig={iconConfig}
						>
							{label}
						</Button>
					),
			)}
		</div>
	);
}
