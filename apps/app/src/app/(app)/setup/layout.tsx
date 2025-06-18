export default async function SetupLayout({ children }: { children: React.ReactNode }) {
  // During setup, there's no current organization yet
  return <main className="mx-auto max-h-[calc(100vh-100px)] px-4 pb-8">{children}</main>;
}
