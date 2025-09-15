import { assertMatch } from "$std/assert/assert_match.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import Template, { replaceVariables } from "./template.ts";
import { assert } from "$std/assert/assert.ts";

Deno.test("replaceVariables replaces placeholders with given set of variables", () => {
  const result = replaceVariables(
    "Hello {{ name }}; wie geht es {{name}}? Sie sind {{accepted?}} oder auch {{ nicht }}",
    {
      name: "Welt",
      "accepted?": "sehrwohl",
    },
  );

  assertEquals(
    result,
    "Hello Welt; wie geht es Welt? Sie sind sehrwohl oder auch {{ nicht }}",
  );
});

Deno.test("replaceVariables securely replaces placeholder with a given set of variables", () => {
  const actual = replaceVariables(
    "A: {{ _unsafe_content }}; B: {{ content }}",
    {
      _unsafe_content: `<script> alert(1) </script> "foo" 'bar/foo'`,
      content: `<script> alert(1) </script> "foo" 'bar/foo'`,
    },
  );

  assertEquals(
    actual,
    `A: <script> alert(1) </script> "foo" 'bar/foo'; B: &lt;script&gt; alert(1) &lt;/script&gt; &quot;foo&quot; &#49;bar/foo&#49;`,
  );
});

Deno.test("new Template loads both html and markdown files and replaces text", async () => {
  const vars = {
    username: "FOO",
    verificationUrl: "hello-world",
  };
  const template = new Template("verification", vars);

  const text = await template.getText();
  assertMatch(text, /Hallo FOO/);
  assert(text.includes(vars.verificationUrl));

  const html = await template.getHtml();
  assertMatch(html, new RegExp(`Hallo <b>${vars.username}<\\/b>!`));
  assert(html.includes(`href="${vars.verificationUrl}"`));
  assert(html.includes("<center><div"));
});
