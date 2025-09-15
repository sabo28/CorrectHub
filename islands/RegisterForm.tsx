import { useState } from "preact/hooks";
import { Button } from "./Button.tsx";
import ErrorMessage from "../components/ErrorMessage.tsx";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      location.href = "/login?m=reg_success";
    } else {
      const error = await res.json();
      setError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      {error && <ErrorMessage errorObj={error} />}

      <input
        name="username"
        value={formData.username}
        onInput={handleChange}
        type="text"
        placeholder="Benutzername"
        required
        class="border p-2 w-full"
      />
      <input
        name="email"
        value={formData.email}
        onInput={handleChange}
        type="email"
        placeholder="E-Mail"
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
        <Button type="submit" btnSize="sm">
          Registrieren
        </Button>

        <Button href="/" variant="regular" btnSize="sm">
          Bereits registriert? Login
        </Button>
      </div>
    </form>
  );
}
