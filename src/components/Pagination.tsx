import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show at most 5 page numbers centered around current page
  const visiblePages = pages.filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1
  );

  return (
    <nav className="flex justify-center items-center gap-2 mt-12">
      {/* Previous */}
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 border border-black/10 text-sm text-ink no-underline hover:bg-sakura/10 transition-colors duration-300"
        >
          前へ
        </Link>
      )}

      {/* Page Numbers */}
      {visiblePages.map((page, index) => {
        // Add ellipsis if there's a gap
        const prevPage = visiblePages[index - 1];
        const showEllipsis = prevPage && page - prevPage > 1;

        return (
          <span key={page} className="flex items-center gap-2">
            {showEllipsis && (
              <span className="px-2 text-warmgray">...</span>
            )}
            {page === currentPage ? (
              <span className="px-4 py-2 bg-ink text-paper text-sm">
                {page}
              </span>
            ) : (
              <Link
                href={`${basePath}?page=${page}`}
                className="px-4 py-2 border border-black/10 text-sm text-ink no-underline hover:bg-sakura/10 transition-colors duration-300"
              >
                {page}
              </Link>
            )}
          </span>
        );
      })}

      {/* Next */}
      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 border border-black/10 text-sm text-ink no-underline hover:bg-sakura/10 transition-colors duration-300"
        >
          次へ
        </Link>
      )}
    </nav>
  );
}
