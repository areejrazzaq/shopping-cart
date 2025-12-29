import { Button } from '@/components/ui/button';
import { Check, Mail, Send } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // TODO: Implement newsletter subscription
        console.log('Subscribe:', email);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsSubmitting(false);
        setEmail('');
    };

    return (
        <footer className="w-full">
            {/* Top Section */}
            <div className="border-b border-border bg-background py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                            <Check className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                                KICKR — Sneakers & Drops
                            </h2>
                            <p className="mt-2 text-base text-muted-foreground">
                                Discover curated sneakers from top and emerging brands. Fast
                                shipping, easy returns, and support that actually helps.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Section */}
            <div className="bg-neutral-900 dark:bg-neutral-950">
                <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {/* Stay in the loop */}
                        <div className="space-y-4">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-sm font-medium text-white">
                                    Free shipping over $75
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white">Stay in the loop</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-sm text-neutral-300">
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                    <span>Weekly drops and early access.</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-neutral-300">
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                    <span>Members-only pricing on selects.</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-neutral-300">
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                    <span>One email a week. No spam.</span>
                                </li>
                            </ul>
                            <form onSubmit={handleSubscribe} className="mt-6 space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@domain.com"
                                        required
                                        className="flex-1 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        size="default"
                                        className="shrink-0 bg-white text-neutral-900 hover:bg-neutral-100"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* SHOP */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                                SHOP
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#new-arrivals"
                                        className="text-sm text-neutral-300 transition-colors hover:text-white"
                                    >
                                        New Arrivals
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#men"
                                        className="text-sm text-neutral-300 transition-colors hover:text-white"
                                    >
                                        Men
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#women"
                                        className="text-sm text-neutral-300 transition-colors hover:text-white"
                                    >
                                        Women
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#sale"
                                        className="text-sm text-neutral-300 transition-colors hover:text-white"
                                    >
                                        Sale
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* SUPPORT */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                                SUPPORT
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#help"
                                        className="text-sm text-neutral-300 transition-colors hover:text-white"
                                    >
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#shipping"
                                        className="text-sm text-neutral-300 transition-colors hover:text-white"
                                    >
                                        Shipping & Returns
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#size-guide"
                                        className="text-sm text-neutral-300 transition-colors hover:text-white"
                                    >
                                        Size Guide
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#contact"
                                        className="text-sm text-neutral-300 transition-colors hover:text-white"
                                    >
                                        Contact us
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* COMPANY */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                                COMPANY
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#about"
                                        className="text-sm text-neutral-300 transition-colors hover:text-white"
                                    >
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#careers"
                                        className="text-sm text-neutral-300 transition-colors hover:text-white"
                                    >
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#sustainability"
                                        className="text-sm text-neutral-300 transition-colors hover:text-white"
                                    >
                                        Sustainability
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#press"
                                        className="text-sm text-neutral-300 transition-colors hover:text-white"
                                    >
                                        Press
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-neutral-800 bg-neutral-900 dark:bg-neutral-950">
                <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="text-xs text-neutral-400">
                            © 2025 KICKR | Privacy / Terms
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="#instagram"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-900 transition-colors hover:bg-neutral-100"
                                aria-label="Instagram"
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                            <a
                                href="#twitter"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-900 transition-colors hover:bg-neutral-100"
                                aria-label="Twitter"
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a
                                href="#youtube"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-900 transition-colors hover:bg-neutral-100"
                                aria-label="YouTube"
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                            <a
                                href="#accessibility"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-900 transition-colors hover:bg-neutral-100"
                                aria-label="Accessibility"
                            >
                                <span className="text-xs font-bold">A</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

