import { Head } from "$fresh/runtime.ts";
import Headline from "../components/Headline.tsx";

export default function Error404() {
  return (
    <>
      <Head>
        <title>Seite nicht gefunden</title>
      </Head>

      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <Headline>Seite nicht gefunden</Headline>

        <p class="my-4">
          Die angeforderte Seite wurde nicht gefunden
        </p>
      </div>
    </>
  );
}
