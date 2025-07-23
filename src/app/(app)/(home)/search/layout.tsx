export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="min-h-screen bg-white">
        {children}
      </div>
    </main>
  );
}
