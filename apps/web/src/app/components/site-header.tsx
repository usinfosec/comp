import { MainNav } from "@/app/components/main-nav";
import { ModeSwitcher } from "@/app/components/mode-switcher";

export function SiteHeader() {
  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 items-center">
          <MainNav />
          <div className="flex flex-1 items-center justify-end gap-2">
            <nav className="flex items-center gap-0.5">
              <ModeSwitcher />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
