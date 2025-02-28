"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { History, Loader2 } from "lucide-react";
import { PkHistoryEmpty } from "./pk-history-empty";
import { useGenHistory } from "@/hooks/db/use-gen-history";
import { PkHistoryList } from "./pk-history-list";
import { useIsMobile } from "@/hooks/global/use-mobile";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function PkHistoryInterface() {
  const t = useTranslations("pk_history");

  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { history, deleteHistory } = useGenHistory(page);

  const handleDelete = useCallback(
    (id: string) => {
      deleteHistory(id);
    },
    [deleteHistory]
  );

  if (!history) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        <Loader2 className="animate-spin" />
        {t("loading")}
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <History className="absolute right-6 top-4 h-6 w-6 cursor-pointer text-muted-foreground hover:text-muted-foreground/80" />
      </DialogTrigger>
      <DialogContent
        className={cn(
          "h-[80vh] min-w-[40vw] pb-12",
          isMobile && "min-w-full",
          history.total === 0 ? "pb-0" : "content-start"
        )}
      >
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {history.total === 0 ? (
          <PkHistoryEmpty />
        ) : (
          <PkHistoryList
            history={history.items}
            onClick={() => {
              setOpen(false);
            }}
            onDelete={handleDelete}
          />
        )}

        {history.totalPages > 1 && (
          <div className="@lg:pb-3 absolute bottom-0 left-0 right-0 pb-4">
            <Pagination>
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={cn(
                      page === 1 && "pointer-events-none opacity-50"
                    )}
                    aria-label={t("pagination.previous")}
                  >
                    <span>{t("pagination.previous")}</span>
                  </PaginationPrevious>
                </PaginationItem>
                {Array.from(
                  { length: history.totalPages },
                  (_, i) => i + 1
                ).map((pageNumber) => {
                  // Show first page, current page, last page, and pages around current page
                  if (
                    pageNumber === 1 ||
                    pageNumber === history.totalPages ||
                    (pageNumber >= page - 1 && pageNumber <= page + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setPage(pageNumber)}
                          isActive={page === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  // Show ellipsis for gaps
                  if (
                    pageNumber === 2 ||
                    pageNumber === history.totalPages - 1
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationEllipsis>
                          <span className="sr-only">
                            {t("pagination.more_pages")}
                          </span>
                        </PaginationEllipsis>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((p) => Math.min(history.totalPages, p + 1))
                    }
                    className={cn(
                      page === history.totalPages &&
                        "pointer-events-none opacity-50"
                    )}
                    aria-label={t("pagination.next")}
                  >
                    <span>{t("pagination.next")}</span>
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
