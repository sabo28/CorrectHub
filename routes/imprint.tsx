export default function ImprintPage() {
  return (
    <div class="space-y-6 text-gray-700">
      <h1 class="text-2xl font-bold text-gray-900 border-b pb-2">Impressum</h1>

      <section>
        <h2 class="text-lg font-semibold mb-1">Herausgeber</h2>
        <p>
          Benjamin Falk,<br />
          Labeeb Malik,<br />
          Antony Cherukattu<br />
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-1">Kontakt</h2>
        <p>
          Telefon:{" "}
          <a href="tel:+491234567890" class="text-blue-600 hover:underline">
            +49 123 456 7890
          </a>
          <br />
          E-Mail:{" "}
          <a
            href="mailto:korrektur@iu-study.org"
            class="text-blue-600 hover:underline"
          >
            korrektur@iu-study.org
          </a>
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-1">Haftungsausschluss</h2>
        <p>
          Dieses Impressum dient ausschließlich zu Demonstrationszwecken im
          Rahmen eines Studienprojekts und erhebt keinen Anspruch auf rechtliche
          Vollständigkeit oder Gültigkeit. Die Anwendung erfolgt im geschützten,
          nicht-öffentlichen Rahmen.
        </p>
      </section>
    </div>
  );
}
