import { ThemeSelector } from "@/components/ui/theme-selector";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

export default function ThemeShowcasePage() {
    return (
        <div className="container mx-auto py-8 space-y-10">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Theme Showcase</h1>
                <div className="flex items-center gap-2">
                    <ThemeSelector />
                    <ThemeToggle />
                </div>
            </header>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold">Color Palette</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ColorCard name="Background" color="bg-background" textColor="text-foreground" />
                    <ColorCard name="Foreground" color="bg-foreground" textColor="text-background" />
                    <ColorCard name="Primary" color="bg-primary" textColor="text-primary-foreground" />
                    <ColorCard name="Secondary" color="bg-secondary" textColor="text-secondary-foreground" />
                    <ColorCard name="Muted" color="bg-muted" textColor="text-muted-foreground" />
                    <ColorCard name="Accent" color="bg-accent" textColor="text-accent-foreground" />
                    <ColorCard name="Border" color="bg-border" textColor="text-foreground" />
                    <ColorCard name="Card" color="bg-card" textColor="text-card-foreground" />
                    <ColorCard name="Hover" color="bg-hover" textColor="text-foreground" />
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold">Typography</h2>
                <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">Font Families</h3>
                        <p className="font-sans">Primary Font (sans): The quick brown fox jumps over the lazy dog.</p>
                        <p className="font-mono">Secondary Font (mono): The quick brown fox jumps over the lazy dog.</p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">Font Sizes</h3>
                        <p className="text-xs">Extra Small (xs): The quick brown fox jumps over the lazy dog.</p>
                        <p className="text-sm">Small (sm): The quick brown fox jumps over the lazy dog.</p>
                        <p className="text-base">Base (base): The quick brown fox jumps over the lazy dog.</p>
                        <p className="text-lg">Large (lg): The quick brown fox jumps over the lazy dog.</p>
                        <p className="text-xl">Extra Large (xl): The quick brown fox jumps over the lazy dog.</p>
                        <p className="text-2xl">2XL (2xl): The quick brown fox jumps over the lazy dog.</p>
                        <p className="text-3xl">3XL (3xl): The quick brown fox jumps over the lazy dog.</p>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold">Components</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 bg-card rounded-lg border border-border">
                        <h3 className="text-xl font-bold mb-4">Buttons</h3>
                        <div className="flex flex-wrap gap-4">
                            <Button variant="default">Default</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="link">Link</Button>
                        </div>
                    </div>

                    <div className="p-6 bg-card rounded-lg border border-border">
                        <h3 className="text-xl font-bold mb-4">Border Radius</h3>
                        <div className="flex flex-wrap gap-4">
                            <div className="w-16 h-16 bg-primary rounded-sm flex items-center justify-center">sm</div>
                            <div className="w-16 h-16 bg-primary rounded-md flex items-center justify-center">md</div>
                            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">lg</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function ColorCard({ name, color, textColor }: { name: string; color: string; textColor: string }) {
    return (
        <div className={`${color} ${textColor} p-6 rounded-lg shadow flex flex-col items-center justify-center h-32`}>
            <span className="font-bold">{name}</span>
            <span className="text-sm opacity-80">{`var(--${name.toLowerCase()})`}</span>
        </div>
    );
} 