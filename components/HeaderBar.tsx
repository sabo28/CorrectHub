import { Button } from "../islands/Button.tsx";

interface HeaderBarProps {
  canViewUsers: boolean;
}

export default function HeaderBar(props: HeaderBarProps) {
  return (
    <header class="flex justify-between items-center p-4 bg-white shadow-md">
      <div class="flex">
        <a href="/" class="block mr-4">
          <img
            src="/logo.svg"
            alt="Logo"
            class="w-32"
          />
        </a>

        <a class="p-2" href="/">Meldungen</a>

        {props.canViewUsers && (
          <a class="p-2" href="/users">Benutzerverwaltung</a>
        )}
      </div>

      <div class="flex gap-4">
        <Button href="/report/new" variant="primary">
          Meldung erstellen
        </Button>
        <Button href="/logout" variant="error">
          Logout
        </Button>
      </div>
    </header>
  );
}
