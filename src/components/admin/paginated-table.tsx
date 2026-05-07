"use client";

import React, { useState } from "react";
import { Table } from "./ui/Table";
import { Button } from "./ui/Button";

interface PaginatedTableProps {
  headers: React.ReactNode;
  children: React.ReactNode;
  itemsPerPage?: number;
}

export function PaginatedTable({ headers, children, itemsPerPage = 10 }: PaginatedTableProps) {
  const [page, setPage] = useState(1);
  const items = React.Children.toArray(children);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = items.slice(start, end);

  return (
    <div className="space-y-4">
      <Table>
        {headers}
        <tbody className="[&_tr:last-child]:border-0">
          {currentItems}
        </tbody>
      </Table>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-[#8a867f]">
            Showing {start + 1} to {Math.min(end, items.length)} of {items.length} entries
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
