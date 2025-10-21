import { ReactNode } from "react";
import { PixelCreativeLogo } from "@/components/icons";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="absolute top-8 left-8 flex items-center gap-2">
            <PixelCreativeLogo className="size-8 text-primary" />
            <span className="font-headline text-lg font-semibold">
                Pixel Creative
            </span>
        </div>
        {children}
    </div>
  );
}
