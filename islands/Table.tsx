import { ComponentChildren } from "preact";

interface IColumn<T> {
  label: string;
  sortable?: boolean;

  center?: boolean;
  headerCellClass?: string;
  rowCellClass?: string;

  renderer?: (row: T, columnName: keyof T) => ComponentChildren;
}

interface ITableProps<T> {
  columns: Partial<Record<keyof T, IColumn<T>>>;
  rowId: keyof T;
  rows: T[];
  rowHref?: (row: T) => string;
  orderBy: keyof T;
  sortOrder: "asc" | "desc";
  emptyMessage: string;
  onSort?: (orderBy: keyof T, sortOrder: "asc" | "desc") => void;
}

export default function Table<T>(props: ITableProps<T>) {
  const getColumn = (columnName: keyof T): IColumn<T> => {
    const column = props.columns[columnName];
    if (!column) {
      throw new Error(`missing column config for '${String(columnName)}'`);
    }

    column.sortable = column.sortable ?? true;

    return column;
  };

  const getColumnLabel = (columnName: keyof T): string => {
    const column = getColumn(columnName);
    return column.label;
  };

  const renderColumn = (row: T, columnName: keyof T) => {
    const column = getColumn(columnName);

    if (column.renderer) {
      return column.renderer(row, columnName);
    }

    return String(row[columnName]);
  };

  const handleRowClick = (row: T) => () => {
    if (!props.rowHref) {
      return;
    }

    const href = props.rowHref(row);
    location.href = href;
  };

  const handleSort = (columnName: keyof T) => () => {
    const column = getColumn(columnName);
    if (!column.sortable || !props.onSort) {
      return;
    }

    const isAsc = props.sortOrder === "asc";
    const shouldBeAsc = props.orderBy === columnName ? !isAsc : true;
    const sortOrder = shouldBeAsc ? "asc" : "desc";

    props.onSort(columnName, sortOrder);
  };

  const getSortIndicator = (columnName: keyof T) => {
    const column = getColumn(columnName);
    if (!column.sortable) {
      return;
    }

    if (props.orderBy === columnName) {
      return props.sortOrder === "asc" ? " ↑" : " ↓";
    }
    return " ⇅";
  };

  return (
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr class="bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            {Object.keys(props.columns).map((key) => {
              const columnName = key as keyof T;
              const column = getColumn(columnName);
              const classes = [
                "px-3 py-3 select-none",
                column.sortable ? "cursor-pointer" : "cursor-default",
                column.headerCellClass,
                column.center && "text-center",
              ].filter(Boolean).join(" ");

              return (
                <th
                  key={columnName}
                  class={classes}
                  onClick={handleSort(columnName)}
                >
                  {getColumnLabel(columnName)}
                  {getSortIndicator(columnName)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row) => {
            const rowClasses = [
              "border-b border-gray-200",
              props.rowHref && "cursor-pointer",
              props.rowHref && "hover:bg-gray-50",
            ].filter(Boolean).join(" ");
            return (
              <tr
                key={String(row[props.rowId])}
                class={rowClasses}
                onClick={handleRowClick(row)}
              >
                {Object.keys(props.columns).map((key) => {
                  const columnName = key as keyof T;
                  const column = getColumn(columnName);
                  const classes = [
                    "px-3 py-4 whitespace-normal break-words text-sm text-gray-900",
                    column.rowCellClass,
                    column.center && "text-center",
                  ].filter(Boolean).join(" ");

                  return (
                    <td
                      class={classes}
                    >
                      {renderColumn(row, columnName)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {!props.rows.length && (
            <tr>
              <td
                colSpan={Object.keys(props.columns).length}
                class="px-6 py-4 text-center text-gray-500"
              >
                {props.emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
