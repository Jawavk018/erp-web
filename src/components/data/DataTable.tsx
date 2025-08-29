import { useState, useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { Search, Download, ChevronDown, ChevronUp, Edit, Trash, Eye, Plus } from 'lucide-react';
import { exportToExcel } from '@/lib/utils';
// import { exportToExcel } from '@/utils/utils';
// import { exportToExcel } from '../../lib/utils';

// interface DataTableProps {
//   columns: any[];
//   data: any[];
//   title: string;
//   // onAdd: () => void;
//   onAdd?: () => void;
//   onEdit: (row: any) => void;
//   onDelete: (row: any) => void;
//   onView: (row: any) => void;
//   filterPlaceholder?: string;
// }

interface DataTableProps {
  columns: any[];
  data: any[];
  title: string;
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  showActions?: boolean;
  showAddActions?: boolean;
  filterPlaceholder?: string;
}

export function DataTable({
  columns,
  data,
  title,
  onAdd,
  onEdit,
  onDelete,
  onView,
  showActions = false,
  showAddActions = true,
  filterPlaceholder = 'Search...'
}: DataTableProps) {
  const [filterInput, setFilterInput] = useState('');

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  }: any = useTable(
    {
      columns,
      data,
      // initialState: { pageIndex: 0, pageSize: 10 }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { pageIndex, pageSize } = state;

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || '';
    setGlobalFilter(value);
    setFilterInput(value);
  };

  const handleExport = () => {
    exportToExcel(data, title);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-secondary-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary-800">{title}</h2>
          <div className="flex items-center mt-2 md:mt-0 space-x-2">
            <div className="relative">
              <input
                value={filterInput}
                onChange={handleFilterChange}
                placeholder={filterPlaceholder}
                className="pl-9 pr-4 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
            </div>
            <button
              onClick={handleExport}
              className="p-2 bg-secondary-100 text-secondary-700 rounded-md hover:bg-secondary-200 flex items-center"
            >
              <Download className="w-4 h-4 mr-1" />
              <span>Export</span>
            </button>
            {showAddActions && (
              <button
                onClick={onAdd}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-primary-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1 text-red-100" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-secondary-50">
            {headerGroups.map((headerGroup: any) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <ChevronDown className="w-4 h-4 ml-1" />
                          ) : (
                            <ChevronUp className="w-4 h-4 ml-1" />
                          )
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                  </th>
                ))}
                {showActions && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-secondary-200">
            {page.map((row: any) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-secondary-50">
                  {row.cells.map((cell: any) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView(row.original)}
                        className="text-blue-600 hover:text-blue-800 action-icon"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(row.original)}
                        className="text-amber-600 hover:text-amber-800 action-icon"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(row.original)}
                        className="text-red-600 hover:text-red-800 action-icon"
                        title="Delete"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td> */}
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {onView && (
                          <button
                            onClick={() => onView(row.original)}
                            className="text-blue-600 hover:text-blue-800 action-icon"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row.original)}
                            className="text-amber-600 hover:text-amber-800 action-icon"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row.original)}
                            className="text-red-600 hover:text-red-800 action-icon"
                            title="Delete"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 flex items-center justify-between border-t border-secondary-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="relative inline-flex items-center px-4 py-2 border border-secondary-300 text-sm font-medium rounded-md text-secondary-700 bg-white hover:bg-secondary-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-secondary-300 text-sm font-medium rounded-md text-secondary-700 bg-white hover:bg-secondary-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-secondary-700">
              Showing <span className="font-medium">{pageIndex * pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min((pageIndex + 1) * pageSize, data.length)}
              </span>{' '}
              of <span className="font-medium">{data.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" />
              </button>

              {[...Array(Math.min(5, pageCount))].map((_, i) => {
                const pageNum = i + Math.max(0, pageIndex - 2);
                if (pageNum < pageCount) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => gotoPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageIndex === pageNum
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50'
                        }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                }
                return null;
              })}

              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}