import { assertEquals } from "$std/assert/mod.ts";
import Uuid from "../value-objects/uuid.ts";
import {
  NoPermissionToUpdateField,
  NoPermissionToUpdateReport,
  ReportAlreadyExists,
} from "./error.ts";

Deno.test("ReportAlreadyExists", () => {
  const id = new Uuid("203d8da1-0c77-4e62-871a-1a4bb8acab25");
  const err = new ReportAlreadyExists(id);

  assertEquals(
    err.message,
    "Report with id '203d8da1-0c77-4e62-871a-1a4bb8acab25' already exists",
  );
});

Deno.test("NoPermissionToUpdateReport", () => {
  const id = new Uuid("203d8da1-0c77-4e62-871a-1a4bb8acab25");
  const err = new NoPermissionToUpdateReport(id);

  assertEquals(
    err.message,
    "Report with id '203d8da1-0c77-4e62-871a-1a4bb8acab25' cannot be changed due to lack of permissions",
  );
});

Deno.test("NoPermissionToUpdateField", () => {
  const id = new Uuid("203d8da1-0c77-4e62-871a-1a4bb8acab25");
  const err = new NoPermissionToUpdateField(id, "test");

  assertEquals(
    err.message,
    "Field 'test' of report with id '203d8da1-0c77-4e62-871a-1a4bb8acab25' cannot be changed due to lack of permissions",
  );
});
