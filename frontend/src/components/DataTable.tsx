type Column<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
};

export function DataTable<T extends Record<string, unknown>>({ columns, rows }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-200 text-sm">
          <thead className="bg-stone-50">
            <tr>
              {columns.map((column) => (
                <th
                  className="whitespace-nowrap px-4 py-3 text-left font-semibold text-stone-700"
                  key={String(column.key)}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((row, rowIndex) => (
              <tr className="hover:bg-amber-50/50" key={rowIndex}>
                {columns.map((column) => (
                  <td className="whitespace-nowrap px-4 py-3 text-stone-700" key={String(column.key)}>
                    {column.render ? column.render(row) : String(row[column.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
