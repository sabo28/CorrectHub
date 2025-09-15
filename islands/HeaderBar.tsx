import { useState } from "preact/hooks";
import { Button } from "./Button.tsx";

interface HeaderBarProps {
  canViewUsers: boolean;
}

export default function HeaderBar(props: HeaderBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header class="flex justify-between items-center p-4 bg-white shadow-md relative">
      <div class="flex items-center">
        <a href="/" class="block mr-4">
          <img
            src="/logo.svg"
            alt="Logo"
            class="w-32"
          />
        </a>
        <nav class="hidden md:flex space-x-2">
          <a
            class="p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
            href="/"
          >
            Meldungen
          </a>

          {props.canViewUsers && (
            <a
              class="p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
              href="/users"
            >
              Benutzerverwaltung
            </a>
          )}
        </nav>
      </div>

      <div class="flex items-center">
        <div class="hidden md:flex gap-4">
          <Button href="/report/new" variant="primary">
            Meldung erstellen
          </Button>
          <Button href="/logout" variant="error">
            Logout
          </Button>
        </div>
        <button
          onClick={toggleMenu}
          type="button"
          class="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen
              ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                >
                </path>
              )
              : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                >
                </path>
              )}
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <div
          id="mobile-menu"
          class="absolute top-full right-4 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 md:hidden" // 'md:hidden' um sicherzustellen, dass es auf Desktops nicht erscheint
        >
          <nav class="flex flex-col p-2 space-y-1">
            <a
              onClick={toggleMenu}
              class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
              href="/"
            >
              Meldungen
            </a>
            {props.canViewUsers && (
              <a
                onClick={toggleMenu}
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                href="/users"
              >
                Benutzerverwaltung
              </a>
            )}
            <hr class="border-t border-gray-200 my-1" />
            <Button
              href="/report/new"
              variant="primary"
              class="w-full text-left justify-start"
            >
              Meldung erstellen
            </Button>
            <Button
              href="/logout"
              variant="error"
              class="w-full text-left justify-start"
            >
              Logout
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
