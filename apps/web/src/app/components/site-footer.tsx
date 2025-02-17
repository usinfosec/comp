import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-end gap-4 md:h-16 md:flex-row">
        <ul className="flex gap-4">
          <li>
            <Link
              href="https://github.com/trycompai/comp"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:underline"
            >
              GitHub
            </Link>
          </li>
          <li>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy
            </Link>
          </li>
          <li>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
