export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-2">
      <img src="/logos/logo_red.svg" width={164} height={164} />
      <h1 className="text-xl font-semibold">UBC Marketing Association</h1>
      <p className="text-sm text-muted-foreground">
        {' '}
        {
          "Our portal is currently under development. We'll see you in September!"
        }
      </p>
    </div>
  );
}
