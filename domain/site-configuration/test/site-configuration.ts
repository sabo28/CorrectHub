import SiteConfiguration from "../site-configuration.ts";

export default function newTestSiteConfiguration() {
  return new SiteConfiguration(
    new URL("http://example.com"),
    undefined,
    undefined,
    "sessionId",
    "/",
  );
}
