import ChangePasswordForm from "../islands/ChangePasswordForm.tsx";
import Headline from "../components/Headline.tsx";

export default function ChangePasswordPage() {
  return (
    <div class="p-8">
      <div class="mb-10">
        <Headline>Passwort ändern</Headline>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
