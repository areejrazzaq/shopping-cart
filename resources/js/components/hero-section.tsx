import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    ExternalLink,
    Eye,
    Headphones,
    RefreshCw,
    Truck,
} from 'lucide-react';

interface FeatureHighlight {
    icon: React.ComponentType<{ className?: string }>;
    text: string;
    iconColor: string;
}

const features: FeatureHighlight[] = [
    {
        icon: Truck,
        text: 'Free shipping over $75',
        iconColor: 'text-green-600 dark:text-green-400',
    },
    {
        icon: RefreshCw,
        text: '30-day returns',
        iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
        icon: Headphones,
        text: '24/7 support',
        iconColor: 'text-purple-600 dark:text-purple-400',
    },
];

export function HeroSection() {
    return (
        <section className="relative min-h-[500px] overflow-hidden bg-linear-to-br from-neutral-100 via-neutral-50 to-white lg:min-h-[550px] dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid min-h-[500px] items-center gap-8 lg:min-h-[550px] lg:grid-cols-2 lg:gap-12">
                    {/* Left Section - Text Content */}
                    <div className="flex flex-col justify-center space-y-8 py-12 lg:py-20">
                        {/* Headline */}
                        <div className="space-y-4">
                            <h1 className="font-geist text-4xl leading-[1.05] tracking-tighter text-black sm:text-6xl lg:text-7xl">
                                Sneakers that move with you
                                <span className="font-geist block tracking-tighter text-black/40">
                                    Premium comfort meets everyday style.
                                </span>
                            </h1>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                            <Button
                                size="lg"
                                className="group h-12 rounded-lg bg-foreground px-6 text-base font-medium text-background shadow-md hover:bg-foreground/90"
                                asChild
                            >
                                <Link href="#shop">
                                    Shop new arrivals
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="lg"
                                className="group h-12 rounded-lg px-6 text-base font-medium"
                                asChild
                            >
                                <Link href="#best-sellers">
                                    Explore best sellers
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        {/* Feature Highlights */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            {features.map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/50 px-4 py-2.5"
                                    >
                                        <IconComponent
                                            className={`h-5 w-5 ${feature.iconColor}`}
                                        />
                                        <span className="text-sm font-medium text-foreground">
                                            {feature.text}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Section - Product Image */}
                    <div className="relative h-[450px] overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 sm:h-[500px] lg:h-[550px] dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
                        {/* Product Image */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img
                                src="/images/hero-img.jpg"
                                alt="Nike Air Max 270 - Premium sneakers that move with you"
                                className="h-full w-full scale-110 object-cover object-center"
                                style={{
                                    filter: 'drop-shadow(0 0 40px rgba(59, 130, 246, 0.3))',
                                }}
                            />
                        </div>

                        {/* Glow effect for the air unit */}
                        <div className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-3/4 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-400/15" />

                        {/* Overlay Elements */}
                        <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between">
                            {/* Fresh Drop Badge */}
                            <div className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/90 px-3 py-1.5 backdrop-blur-sm">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                                <span className="text-xs font-medium text-foreground">
                                    Fresh drop: AeroFlex V3
                                </span>
                            </div>

                            {/* Quick View Button */}
                            <Button
                                variant="secondary"
                                size="sm"
                                className="rounded-full border border-border/50 bg-muted/90 backdrop-blur-sm hover:bg-muted"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Quick view
                            </Button>
                        </div>

                        {/* Gradient Overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-900/50 via-transparent to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    );
}
