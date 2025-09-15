import { useState } from "preact/hooks";
import ErrorMessage from "../components/ErrorMessage.tsx";
import { Button } from "./Button.tsx";

export default function ForgotPasswordForm() {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const res = await fetch("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      location.href = "/login?m=reset_success";
    } else {
      setError(
        "Fehler beim Zurücksetzen des Passworts. Bitte versuche es später erneut.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      {error && <ErrorMessage errorObj={error} />}

      <input
        name="email"
        value={formData.email}
        onInput={handleChange}
        type="email"
        placeholder="E-Mail"
        required
        class="border p-2 w-full"
      />

      <div class="grid grid-cols-2 justify-items-stretch gap-2">
        <Button type="submit" btnSize="sm">
          Passwort zurücksetzen
        </Button>

        <Button href="/" variant="regular" btnSize="sm">
          Zurück zum Login
        </Button>
      </div>
    </form>
  );
}
