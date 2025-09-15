import { JSX } from "preact";
import { useCallback, useState } from "preact/hooks";
import Report, { IPrimitiveReport } from "@domain/report/report.ts";
import PriorityBadge from "../components/PriorityBadge.tsx";
import RelativeDate from "../components/RelativeDate.tsx";
import Table from "./Table.tsx";
import ReportCategory from "@domain/report/category.ts";
import StatusBadge from "../components/StatusBadge.tsx";
import debounce from "@utils/debounce.ts";

interface IReportTableProps {
  reports: IPrimitiveReport[];
  orderBy: keyof IPrimitiveReport;
  sortOrder: "asc" | "desc";
  query: string;
}

export default function ReportTable(props: IReportTableProps) {
  const [reports, setReports] = useState<IPrimitiveReport[]>(props.reports);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState(props.query);
  const [orderBy, setOrderBy] = useState(props.orderBy);
  const [sortOrder, setSortOrder] = useState(props.sortOrder);

  const handleSort = async (
    columnName: keyof IPrimitiveReport,
    sortOrder: "asc" | "desc",
  ) => {
    const url = new URL(location.href);
    url.searchParams.set(
      "orderBy",
      Report.primitiveToFieldMap(columnName) ?? "createdAt",
    );
    url.searchParams.set("direction", sortOrder);
    url.searchParams.set("q", searchTerm);

    setLoading(true);
    history.replaceState({}, "", url);

    url.pathname = "/api/report/list";
    const req = await fetch(url);
    const body = await req.json();

    if (!req.ok) {
      console.error(body);
      alert("Hoppla, etwas ist schief gegangen");
    }

    setOrderBy(columnName);
    setSortOrder(sortOrder);
    setReports(body as IPrimitiveReport[]);
    setLoading(false);
  };

  const debouncedSearchTerm = useCallback(
    debounce(async (text: string) => {
      const url = new URL(location.href);
      url.searchParams.set("q", text);

      setLoading(true);
      history.replaceState({}, "", url);

      url.pathname = "/api/report/list";
      const req = await fetch(url);
      const body = await req.json();

      if (!req.ok) {
        console.error(body);
        alert("Hoppla, etwas ist schief gegangen");
      }

      setReports(body as IPrimitiveReport[]);
      setLoading(false);
    }, 300),
    [],
  );

  const handleSearchTerm = (e: JSX.TargetedInputEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
    debouncedSearchTerm(e.currentTarget.value);
  };

  return (
    <div class="w-full p-4">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div class="flex w-full sm:w-auto flex-wrap gap-2">
          <input
            type="text"
            placeholder="🔍 Suchen..."
            defaultValue={props.query}
            class="border px-4 py-2 rounded-md w-full sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onInput={handleSearchTerm}
          />

          <div class="flex gap-2 flex-wrap w-full sm:w-auto [@media(min-width:1064px)]:hidden">
            <select
              class="border rounded-md px-2 py-2 text-sm min-w-[140px] max-w-[180px] flex-1"
              value={orderBy}
              onChange={(e) =>
                handleSort(
                  e.currentTarget.value as keyof IPrimitiveReport,
                  sortOrder,
                )}
            >
              <option value="title">Titel</option>
              <option value="category">Kategorie</option>
              <option value="priority">Priorität</option>
              <option value="status">Status</option>
              <option value="createdAtMillis">Eingangsdatum</option>
            </select>

            <select
              class="border rounded-md px-2 py-2 text-sm min-w-[140px] max-w-[180px] flex-1"
              value={sortOrder}
              onChange={(e) =>
                handleSort(orderBy, e.currentTarget.value as "asc" | "desc")}
            >
              <option value="asc">↑ Aufsteigend</option>
              <option value="desc">↓ Absteigend</option>
            </select>
          </div>
        </div>

        {loading && <div>lädt...</div>}
      </div>

      <div class="grid gap-4 [@media(min-width:1064px)]:hidden">
        {reports.length === 0 && (
          <div class="text-center text-gray-500">Keine Meldungen gefunden.</div>
        )}
        {reports.map((row) => (
          <div
            key={row.id}
            class="block p-4 border rounded-md bg-white shadow hover:bg-gray-50 transition"
          >
            <a
              href={`/report/${row.id}`}
              class="block font-semibold text-base text-blue-800 underline mb-2"
            >
              {row.title}
            </a>

            <div class="text-sm text-gray-700">
              <strong>Autor:</strong> {row.username}
            </div>
            <div class="text-sm text-gray-700">
              <strong>Zugewiesen:</strong> {row.assigneeUsername ?? "—"}
            </div>
            <div class="text-sm text-gray-700">
              <strong>Kategorie:</strong>{" "}
              {ReportCategory.from(row.category).toLocale()}
            </div>
            <div class="text-sm text-gray-700">
              <strong>Priorität:</strong> <PriorityBadge value={row.priority} />
            </div>
            <div class="text-sm text-gray-700">
              <strong>Status:</strong> <StatusBadge value={row.status} />
            </div>
            <div class="text-sm text-gray-700">
              <strong>Eingangsdatum:</strong>{" "}
              <RelativeDate unixMillis={row.createdAtMillis} />
            </div>
          </div>
        ))}
      </div>

      <div class="hidden [@media(min-width:1064px)]:block">
        <Table
          rows={reports}
          rowId="id"
          rowHref={(row) => `/report/${row.id}`}
          onSort={handleSort}
          emptyMessage="Keine Meldungen gefunden."
          orderBy={orderBy}
          sortOrder={sortOrder}
          columns={{
            title: {
              label: "Titel",
              renderer(row) {
                return (
                  <a
                    href={`/report/${row.id}`}
                    aria-label={`Details für die Meldung "${row.title}"`}
                    class="text-blue-800 underline font-semibold text-base"
                  >
                    {row.title}
                  </a>
                );
              },
            },
            username: {
              label: "Autor",
              sortable: false,
            },
            assigneeUsername: {
              label: "Zugewiesen",
              sortable: false,
              renderer(row) {
                return row.assigneeUsername ?? "";
              },
            },
            category: {
              label: "Kategorie",
              renderer(row) {
                return ReportCategory.from(row.category).toLocale();
              },
            },
            priority: {
              label: "Priorität",
              center: true,
              renderer(row) {
                return <PriorityBadge value={row.priority} />;
              },
            },
            status: {
              label: "Status",
              center: true,
              renderer(row) {
                return <StatusBadge value={row.status} />;
              },
            },
            createdAtMillis: {
              label: "Eingangsdatum",
              center: true,
              renderer(row) {
                return <RelativeDate unixMillis={row.createdAtMillis} />;
              },
            },
          }}
        />
      </div>
    </div>
  );
}
