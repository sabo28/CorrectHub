import { useState } from "preact/hooks";
import { Button, Spinner } from "../islands/Button.tsx";
import ErrorMessage from "../components/ErrorMessage.tsx";
import Message from "../components/Message.tsx";
import Snackbar from "../components/Snackbar.tsx";

export interface ILoginFormProps {
  showMessage?: string | null;
}

export default function LoginForm(props: ILoginFormProps) {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const showMessage = props.showMessage && getMessage(props.showMessage);

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      globalThis.location.href = "/";
    } else {
      const error = await res.json();
      setError(error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      {error && <ErrorMessage errorObj={error} />}
      {!error && props.showMessage && (
        <Snackbar type="success">{showMessage}</Snackbar>
      )}

      <Message type="info">
        <p>
          <strong>Demo-Benutzer:</strong>
        </p>
        <ul>
          <li class="list-inside list-disc">admin</li>
          <li class="list-inside list-disc">tutor</li>
          <li class="list-inside list-disc">member</li>
        </ul>
        <p>Sowohl Benutzername als auch Passwort sind gleich</p>
      </Message>

      <input
        name="identifier"
        value={formData.identifier}
        onInput={handleChange}
        type="text"
        placeholder="E‑Mail oder Benutzername"
        required
        class="border p-2 w-full"
      />
      <input
        name="password"
        value={formData.password}
        onInput={handleChange}
        type="password"
        placeholder="Passwort"
        required
        class="border p-2 w-full"
      />

      <div class="grid grid-cols-2 justify-items-stretch gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner /> : "Login"}
        </Button>

        <Button href="/register" variant="regular">
          Registrieren
        </Button>
      </div>

      <div class="text-center">
        <a
          href="/forgot-password"
          class="text-xs text-gray-500 hover:text-gray-700"
        >
          Passwort vergessen?
        </a>
      </div>
    </form>
  );
}

function getMessage(message?: string | null) {
  switch (message) {
    case "reg_success":
      return (
        <>
          Du hast dich erfolgreich registriert!<br />
          <strong>Bitte aktiviere deine E-Mail Addresse.</strong>
        </>
      );
    case "reset_success":
      return (
        <>
          Wir haben dir eine E-Mail zum Zurücksetzen des Passworts
          geschickt.<br />
          <strong>Bitte folge den Anweisungen in der E-Mail.</strong>
        </>
      );
  }
}
