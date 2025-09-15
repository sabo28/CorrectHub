import { useState } from "preact/hooks";
import FilePicker from "../components/FilePicker.tsx";
import ErrorMessage from "../components/ErrorMessage.tsx";
import { Button } from "./Button.tsx";
import ReportCategory, { CategoryName } from "../domain/report/category.ts";
import { IPrimitiveReport } from "@domain/report/report.ts";
import { IPrimitiveUser } from "@domain/user/user.ts";
import { priorityLocalMap } from "@domain/report/priority.ts";

export interface IReportFormProps {
  report?: IPrimitiveReport;
  canSetPriority?: boolean;
  canSetAssignee?: boolean;
  availableAssignees?: IPrimitiveUser[];
}

export default function ReportForm(props: IReportFormProps) {
  const [error, setError] = useState<unknown>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<CategoryName>(
    (props.report?.category as CategoryName) ?? CategoryName.CONTENT_ERROR,
  );
  const [assignee, setAssignee] = useState<string>(
    props.report?.assigneeId ?? "",
  );
  const [priority, setPriority] = useState(20);

  function getLabel(category: CategoryName): string {
    const instance = new ReportCategory(category);
    return instance.toLocale();
  }

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    files.forEach((file) => formData.append("attachments", file));

    const res = await fetch(location.href, {
      method: "POST",
      body: formData,
    });

    const body = await res.json();

    if (!res.ok) {
      setError(body);
      globalThis.scrollTo(0, 0);
      return;
    }

    location.replace("/report/" + body.id);
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      class="space-y-6 text-sm"
    >
      {error && <ErrorMessage errorObj={error} />}

      <div>
        <label htmlFor="category" class="block font-medium mb-1">
          Kategorie
        </label>
        <select
          id="category"
          name="category"
          required
          value={category}
          onChange={(e) => setCategory(e.currentTarget.value as CategoryName)}
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          {Object.values(CategoryName).map((option) => (
            <option key={option} value={option}>
              {getLabel(option)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" class="block font-medium mb-1">Titel</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={props.report?.title}
          required
          placeholder="Kurzer Titel"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="description" class="block font-medium mb-1">
          Beschreibung
        </label>
        <textarea
          id="description"
          name="description"
          required
          placeholder="Beschreibe hier den Fehler möglichst genau..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          rows={5}
        >
          {props.report?.description}
        </textarea>
      </div>

      {props.canSetAssignee &&
        (
          <div>
            <label htmlFor="category" class="block font-medium mb-1">
              Zuweisen an
            </label>
            <select
              id="assignee"
              name="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.currentTarget.value)}
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">– nicht zugewiesen –</option>

              {props.availableAssignees?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        )}

      {props.canSetPriority &&
        (
          <div>
            <label htmlFor="priority" class="block font-medium mb-1">
              Priorität
            </label>
            <select
              id="priority"
              name="priority"
              required
              value={priority}
              onChange={(e) => setPriority(+e.currentTarget.value)}
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              {Object.entries(priorityLocalMap).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

      <div>
        <label class="block font-medium mb-2">Dateien anhängen</label>
        <FilePicker onChange={handleFileChange} />
      </div>

      <div>
        <label htmlFor="links" class="block font-medium mb-1">
          Links
        </label>
        <textarea
          id="links"
          name="links"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          {props.report?.links.join("\n")}
        </textarea>
      </div>

      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isAnonym"
          value="true"
          defaultChecked={props.report?.isAnonym}
          id="anonym"
        />
        <label htmlFor="anonym" class="text-sm">
          Meldung anonym einreichen
        </label>
      </div>

      <div class="grid grid-cols-2 justify-items-stretch gap-2">
        <Button type="submit">
          Meldung {props.report ? "speichern" : "erstellen"}
        </Button>
        <Button href="/" variant="regular">
          Zurück zur Startseite
        </Button>
      </div>
    </form>
  );
}
