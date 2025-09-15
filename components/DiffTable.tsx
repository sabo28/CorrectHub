import { ComponentChildren } from "preact";

type Value = string | number | boolean | string[];

interface IDiffTableProps {
  left?: Record<string, Value>;
  right: Record<string, Value>;
  names: Record<string, string>;
  customRenderers?: Record<string, (value: Value) => ComponentChildren>;
}

const CellClass = (width: string) =>
  `px-2 py-1 text-gray-700 border-b border-r last:border-r-0 ${width}`;

export default function DiffTable(props: IDiffTableProps) {
  const size = "sm";

  const left = props.left ?? {};
  const right = props.right;

  const renderLeft = Object.keys(left).length > 0;
  const cellClass = CellClass(renderLeft ? "w-1/3" : "w-1/2");

  const nameField = (key: string) => props.names[key];
  const renderValue = (fieldName: string, value: Value) => {
    if (props.customRenderers?.[fieldName] != null) {
      return props.customRenderers[fieldName](value);
    }

    return value;
  };

  return (
    <table
      class={`min-w-full border border-gray-200 text-left text-${size}`}
    >
      <tbody>
        {Object.keys(props.names).map((key) => {
          const fieldName = nameField(key);
          if (!fieldName) {
            return null;
          }

          if (JSON.stringify(left[key]) === JSON.stringify(right[key])) {
            return null;
          }

          return (
            <tr key={key} class="odd:bg-white even:bg-gray-50">
              <td class={cellClass}>{nameField(key)}</td>
              {renderLeft
                ? (
                  <td class={`${cellClass}`}>
                    <div class="flex justify-between">
                      <span>{renderValue(key, left[key])}</span>
                      <span class="text-sm text-gray-500 text-right">
                        →
                      </span>
                    </div>
                  </td>
                )
                : null}
              <td class={cellClass}>{renderValue(key, right[key])}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
