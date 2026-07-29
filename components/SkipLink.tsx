export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-indigo-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-md"
    >
      Skip to main content
    </a>
  );
}