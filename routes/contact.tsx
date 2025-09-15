export default function ContactPage() {
  return (
    <div class="space-y-4 text-gray-700">
      <h1 class="text-2xl font-bold text-gray-900 border-b pb-2">Kontakt</h1>

      <section>
        <h2 class="text-lg font-semibold mb-1">So erreichen Sie uns</h2>

        <div class="space-y-7 mt-20">
          <div>
            <p class="font-semibold">Benjamin Falk</p>
            <a
              href="mailto:benjamin.falk@iu-study.org"
              class="text-blue-600 hover:underline"
            >
              benjamin.falk@iu-study.org
            </a>
          </div>
          <div>
            <p class="font-semibold">Labeeb Malik</p>
            <a
              href="mailto:labeeb.malik@iu-study.org"
              class="text-blue-600 hover:underline"
            >
              labeeb.malik@iu-study.org
            </a>
          </div>
          <div>
            <p class="font-semibold">Antony Cherukattu</p>
            <a
              href="mailto:antony.cherukattu@iu-study.org"
              class="text-blue-600 hover:underline"
            >
              antony.cherukattu@iu-study.org
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
