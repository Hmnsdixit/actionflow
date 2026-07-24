export default function LoginPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center">
      <form className="w-full max-w-sm space-y-4 p-8 border rounded-lg">
        <h1 className="text-2xl font-bold text-indigo-900">Log In</h1>
        <input type="email" placeholder="Email" className="w-full border rounded-md px-3 py-2" disabled />
        <input type="password" placeholder="Password" className="w-full border rounded-md px-3 py-2" disabled />
        <button type="submit" className="w-full bg-indigo-900 text-white py-2 rounded-md opacity-60" disabled>
          Log In (wired up Day 4)
        </button>
      </form>
    </main>
  );
}