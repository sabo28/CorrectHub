import { assertEquals } from "$std/assert/mod.ts";
import Link from "./link.ts";

Deno.test("new Link encapsulates URL correctly", () => {
  const link = new Link("http://example.org");
  assertEquals(link.toString(), "http://example.org/");
});

Deno.test("new Link adds protocol when missing", () => {
  const link = new Link("example.org");
  assertEquals(link.toString(), "https://example.org/");
});

Deno.test("Link.fromArray converts array to list of Link", () => {
  const links = Link.fromArray(["example.com", "https://cyanjoe.com"]);
  assertEquals(links.length, 2);
  assertEquals(links.map((l) => l.toString()), [
    "https://example.com/",
    "https://cyanjoe.com/",
  ]);
});

Deno.test("Link.linksFrom converts a string into list of Link", () => {
  const links = Link.linksFrom("example.com\r\nhttps://cyanjoe.com");
  assertEquals(links.length, 2);
  assertEquals(links.map((l) => l.toString()), [
    "https://example.com/",
    "https://cyanjoe.com/",
  ]);
});
