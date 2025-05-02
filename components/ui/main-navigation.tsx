import React from "react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function MainNavigation() {
    return (
        <NavigationMenu className="mb-8">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link href="/" className={navigationMenuTriggerStyle()}>
                        Home
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/game" className={navigationMenuTriggerStyle()}>
                        Game
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="/examples" className={navigationMenuTriggerStyle()}>
                        Examples
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
} 