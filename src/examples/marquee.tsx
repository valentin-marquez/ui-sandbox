import { Marquee } from '@/components/ui/marquee';

export default function MarqueeExample() {
    return (
        <div className="py-8">
            <Marquee>
                {Array(10).fill(0).map((_, i) => {
                    const uniqueId = `marquee-item-${i + 1}-${Date.now()}`;
                    return (
                        <span key={uniqueId} className="px-4 py-2 bg-primary/10 rounded-md">Item {i + 1}</span>
                    );
                })}
            </Marquee>
        </div>
    );
}
