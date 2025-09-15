import { useState } from "preact/hooks";
import { Button, Spinner } from "./Button.tsx";
import Snackbar from "../components/Snackbar.tsx";

interface Props {
  token?: string; // optional → nur bei reset-password vorhanden
}

export default function ChangePasswordForm({ token }: Props) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Die neuen Passwörter stimmen nicht überein.");
      setLoading(false);
      return;
    }

    const body = token ? { token, password: formData.password } : {
      currentPassword: formData.currentPassword,
      password: formData.password,
    };

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      setError("Fehler beim Ändern des Passworts.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4 max-w-md">
      {!token && (
        <div>
          <label class="block mb-1">Aktuelles Passwort</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onInput={handleChange}
            required
            class="border p-2 w-full"
          />
        </div>
      )}

      <div>
        <label class="block mb-1">Neues Passwort</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onInput={handleChange}
          required
          class="border p-2 w-full"
        />
      </div>

      <div>
        <label class="block mb-1">Neues Passwort bestätigen</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onInput={handleChange}
          required
          class="border p-2 w-full"
        />
      </div>

      {error && <Snackbar type="error">{error}</Snackbar>}
      {success && <Snackbar type="success">✅ Passwort geändert!</Snackbar>}
      <div class="grid grid-cols-2 justify-items-stretch gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner /> : "Passwort speichern"}
        </Button>
        <Button href="/" variant="regular">
          Zurück zur Startseite
        </Button>
      </div>
    </form>
  );
}
