import { BadRequest, UnsupportedMediaType } from "@handler/errors.ts";
import { Err, Ok, Result } from "./result.ts";
import { Option } from "./option.ts";

/**
 * Converts the request body from a JSON object or FormData to another object.
 */
export async function requestDataToObject<T>(
  request: Request,
): Promise<Result<Partial<T>, Error>> {
  const contentType = Option.from(
    request.headers.get("Content-Type")?.split(";")[0],
  );

  if (contentType.isNone() || contentType.unwrap().trim() === "") {
    return Err(new BadRequest("missing Content-Type header"));
  }

  switch (contentType.unwrap()) {
    case "application/json": {
      const body = await request.text();
      if (!body) {
        return Err(new BadRequest("empty body"));
      }

      try {
        return Ok(JSON.parse(body) as Partial<T>);
      } catch (e) {
        console.error(e);
        return Err(new BadRequest("invalid JSON body"));
      }
    }
    case "multipart/form-data": {
      const result = await Result.from(request.formData());
      if (result.isErr()) {
        return Err(new BadRequest("unable to parse form data"));
      }

      const collection: Record<string, unknown> = {};
      const formData = result.unwrap();

      for (const key of formData.keys()) {
        const values = formData.getAll(key);
        if (values.length === 1) {
          collection[key] = values[0];
        } else {
          collection[key] = values;
        }
      }

      const data = collection as Partial<T>;
      return Ok(data);
    }
    default:
      return Err(
        new UnsupportedMediaType(contentType.unwrap()),
      );
  }
}
