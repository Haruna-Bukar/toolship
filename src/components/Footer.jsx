export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 py-8 text-center text-sm text-white/50">
      <p>
        © {year} Toolship • Built in Africa Nigeria • <a href="#privacy" className="hover:text-white">Privacy</a> •{" "}
        <a href="#terms" className="hover:text-white">Terms</a> •{" "}
        <a href="#support" className="hover:text-white">Support</a>
      </p>
    </footer>
  );
}
