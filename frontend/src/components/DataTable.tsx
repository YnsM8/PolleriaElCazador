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
    <div className="overflow-hidden rounded-xl premium-card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-cazador-border/50 text-sm">
          <thead className="bg-cazador-dark/50">
            <tr>
              {columns.map((column) => (
                <th
                  className="whitespace-nowrap px-6 py-4 text-left font-sans font-semibold uppercase tracking-wider text-cazador-amber/80 text-xs"
                  key={String(column.key)}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cazador-border/30">
            {rows.map((row, rowIndex) => (
              <tr className="hover:bg-cazador-amber/5 transition-colors duration-200" key={rowIndex}>
                {columns.map((column) => (
                  <td className="whitespace-nowrap px-6 py-4 text-cazador-cream/90 font-light" key={String(column.key)}>
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
