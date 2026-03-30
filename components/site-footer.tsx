export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-muted py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted sm:px-6 sm:text-left">
        <p className="mx-auto max-w-6xl">
          © {new Date().getFullYear()} Kart. Demo storefront.
        </p>
        <p className="mt-2">
          <a
            href="https://kart-backend-18if.onrender.com/health"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-2 hover:underline"
          >
            API health
          </a>
        </p>
      </div>
    </footer>
  );
}
