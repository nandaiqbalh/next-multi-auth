"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function TablePagination({ page, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const setPage = (nextPage) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("page", String(nextPage));
    router.push(`?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).slice(
    Math.max(0, page - 3),
    Math.max(5, page + 2)
  );

  return (
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (page > 1) setPage(page - 1);
            }}
          />
        </PaginationItem>

        {pages.map((item) => (
          <PaginationItem key={item}>
            <PaginationLink
              href="#"
              isActive={item === page}
              onClick={(event) => {
                event.preventDefault();
                setPage(item);
              }}
            >
              {item}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (page < totalPages) setPage(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
