export function Table({ columns, data, onRowClick, sortColumn, sortAsc, onSort, emptyMessage = "Sin datos", minWidth = "500px" }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-accent rounded-2xl blur-md opacity-40 group-hover:opacity-70 transition duration-500" />
      <div className="relative bg-neutral-900/90 border border-pink-500/40 rounded-2xl p-6 min-h-[400px] overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300" style={{ minWidth }}>
          <thead className="text-pink-300 uppercase text-xs border-b border-pink-500/30">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 ${col.sortable ? "cursor-pointer select-none hover:text-white" : ""}`}
                  onClick={col.sortable ? () => onSort(col.key) : undefined}
                >
                  {col.label} {col.sortable && sortColumn === col.key && (sortAsc ? "↑" : "↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={row.id ?? i}
                  onClick={() => onRowClick?.(row)}
                  className="border-b border-pink-500/10 hover:bg-pink-500/5 cursor-pointer transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
