export function OurStory() {
    return (
        <section className="py-12 lg:py-16 bg-gradient-to-br from-muted/30 via-background to-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="border border-border rounded-lg py-8 px-12 mx-auto max-w-4xl bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-sm">
                    {/* Section Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Our story
                        </h2>
                    </div>

                    {/* Story Content */}
                    <div className="space-y-4">
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold leading-relaxed text-foreground max-w-3xl">
                            We curate performance and lifestyle sneakers that feel as good as they look—built for daily miles, city commutes, and weekend sessions.
                        </p>
                        <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                            From independent labels to iconic names, we bring you a considered selection with clear sizing, fair pricing, and fast shipping. Every pair we feature goes through wear-tests and quality checks.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

