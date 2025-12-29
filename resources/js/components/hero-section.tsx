import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink, Eye, Headphones, RefreshCw, Truck } from 'lucide-react';
import { Link } from '@inertiajs/react';

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
        <section className="relative min-h-[500px] lg:min-h-[550px] overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px] lg:min-h-[550px]">
                    {/* Left Section - Text Content */}
                    <div className="flex flex-col justify-center space-y-8 py-12 lg:py-20">
                        {/* Headline */}
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                                Sneakers that move with you
                            </h1>
                            <p className="text-lg sm:text-xl text-muted-foreground max-w-lg">
                                Premium comfort meets everyday style.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <Button
                                size="lg"
                                className="group bg-foreground text-background hover:bg-foreground/90 h-12 px-6 text-base font-medium rounded-lg shadow-md"
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
                                className="group h-12 px-6 text-base font-medium rounded-lg"
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
                                        className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2.5 border border-border/50"
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
                    <div className="relative h-[350px] sm:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
                        {/* Product Image */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img
                                src="/images/hero-img.jpg"
                                alt="Nike Air Max 270 - Premium sneakers that move with you"
                                className="w-full h-full object-cover object-center scale-110"
                                style={{
                                    filter: 'drop-shadow(0 0 40px rgba(59, 130, 246, 0.3))',
                                }}
                            />
                        </div>
                        
                        {/* Glow effect for the air unit */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/20 dark:bg-blue-400/15 blur-3xl rounded-full pointer-events-none" />

                        {/* Overlay Elements */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                            {/* Fresh Drop Badge */}
                            <div className="flex items-center gap-2 rounded-full bg-muted/90 backdrop-blur-sm px-3 py-1.5 border border-border/50">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-medium text-foreground">
                                    Fresh drop: AeroFlex V3
                                </span>
                            </div>

                            {/* Quick View Button */}
                            <Button
                                variant="secondary"
                                size="sm"
                                className="rounded-full bg-muted/90 backdrop-blur-sm border border-border/50 hover:bg-muted"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Quick view
                            </Button>
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}

