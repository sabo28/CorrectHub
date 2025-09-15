export default function FooterBar() {
  return (
    <footer class="bg-gray-100 text-gray-600 text-sm text-center py-4 mt-12 border-t">
      <div class="flex justify-center space-x-6">
        <a href="/contact" class="hover:underline">
          Kontakt
        </a>
        <span>|</span>
        <a href="/imprint" class="hover:underline">
          Impressum
        </a>
      </div>
    </footer>
  );
}
