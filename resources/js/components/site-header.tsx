import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { home, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, ShoppingCart } from 'lucide-react';

interface SiteHeaderProps {
    cartItemCount?: number;
    onCartClick?: () => void;
    canRegister?: boolean;
    variant?: 'full' | 'cart-only';
}

export function SiteHeader({
    cartItemCount = 0,
    onCartClick,
    canRegister = true,
    variant = 'full',
}: SiteHeaderProps) {
    const { auth } = usePage<SharedData>().props;

    const handleLogout = () => {
        router.flushAll();
    };

    const cartButton = (
        <button
            onClick={onCartClick}
            className="relative flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="Shopping cart"
        >
            <ShoppingCart className="h-6 w-6 text-foreground" />
            {cartItemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
            )}
        </button>
    );

    const userMenu = auth.user ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent transition-colors">
                    <UserInfo user={auth.user} />
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        canRegister && (
            <Link
                href={register()}
                className="inline-block rounded-md border border-border bg-foreground px-5 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
            >
                Sign In
            </Link>
        )
    );

    if (variant === 'cart-only') {
        return (
            <div className="flex items-center gap-4">
                {auth.user && cartButton}
                {userMenu}
            </div>
        );
    }

    return (
        <header className="w-full border-b border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between py-4">
                    {/* Left: Brand and Navigation Links */}
                    <div className="flex items-center gap-8">
                        <Link
                            href={home()}
                            className="text-xl font-bold text-foreground hover:opacity-80 transition-opacity"
                        >
                            KICKR
                        </Link>
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="#"
                                className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                            >
                                New
                            </Link>
                            <Link
                                href="#"
                                className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                            >
                                Men
                            </Link>
                            <Link
                                href="#"
                                className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                            >
                                Women
                            </Link>
                            <Link
                                href="#"
                                className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
                            >
                                Kids
                            </Link>
                            <Link
                                href="#"
                                className="text-red-500 text-sm font-medium  hover:text-muted-foreground transition-colors"
                            >
                                Sale
                            </Link>
                        </div>
                    </div>

                    {/* Right: Cart and User Menu */}
                    <div className="flex items-center gap-4">
                        {auth.user && cartButton}
                        {userMenu}
                    </div>
                </nav>
            </div>
        </header>
    );
}

