
"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

export function DataTable({
  columns,
  data,
  page,
  totalPages,
  onPageChange,
  onSort,
  sortBy,
  order,
  loading,
}: any) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return "↕";
    return order === "asc" ? "↑" : "↓";
  };

  return (
    <div>
      {/* TABLE */}
      {loading ? (
        <p className="p-4 text-center">Loading...</p>
      ) : (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const columnKey = header.column.id;

                  return (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border-b cursor-pointer"
                      onClick={() =>
                        columnKey && onSort && onSort(columnKey)
                      }
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {columnKey && (
                          <span className="text-xs">
                            {getSortIcon(columnKey)}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-4">
                  No data found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 border-b text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={page === 1}
          onClick={() => onPageChange((prev: number) => prev - 1)}
          className={`px-4 py-2 rounded-md border ${page === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
            }`}
        >
          ← Prev
        </button>

        <span className="text-sm font-medium text-gray-600">
          Page <span className="text-black">{page}</span> of{" "}
          <span className="text-black">{totalPages}</span>
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange((prev: number) => prev + 1)}
          className={`px-4 py-2 rounded-md border ${page === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
            }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}