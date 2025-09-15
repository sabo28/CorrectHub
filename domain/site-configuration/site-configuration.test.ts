import { assertEquals } from "$std/assert/mod.ts";
import VerificationCode from "../user/verification-code.ts";
import Email from "../value-objects/email.ts";
import Uuid from "../value-objects/uuid.ts";
import SiteConfiguration from "./site-configuration.ts";

Deno.test("SiteConfiguration.url returns valid url", () => {
  const siteConfiguration = new SiteConfiguration(
    new URL("http://example.org"),
  );
  const actual = siteConfiguration.url("test");
  assertEquals(actual, "http://example.org/test");
});

Deno.test("SiteConfiguration.verify returns valid verification url", () => {
  const siteConfiguration = new SiteConfiguration(
    new URL("http://example.org"),
  );
  const verificationCode = VerificationCode.newRandom(
    new Email("test@test.com"),
  );

  const actual = siteConfiguration.verify(verificationCode);
  assertEquals(
    actual,
    `http://example.org/verify?c=${verificationCode.toString()}`,
  );
});

Deno.test("SiteConfiguration.report returns valid report url", () => {
  const siteConfiguration = new SiteConfiguration(
    new URL("http://example.org"),
  );
  const reportId = Uuid.newRandom();

  const actual = siteConfiguration.report(reportId);
  assertEquals(actual, `http://example.org/report/${reportId.toString()}`);
});
