import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface UsePagenationOptions {
  defaultLimit?: number;
  replaceHistory?: boolean;
}

interface PaginationProps {
  current: number;
  totalPages: number;
  onPage: (page: number) => void;
}

interface UsePagenationResult {
  page: number;
  limit: number;
  offset: number;
  totalPages: number;
  setPage: (page: number, options?: { replace?: boolean }) => void;
  setLimit: (
    limit: number,
    options?: { replace?: boolean; preservePage?: boolean }
  ) => void;
  paginationProps: PaginationProps;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function usePagenation(
  totalCount: number,
  options: UsePagenationOptions = {}
): UsePagenationResult {
  const { defaultLimit = 12, replaceHistory = true } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const rawPage = Number(searchParams.get("page") ?? 1);
  const rawLimit = Number(searchParams.get("limit") ?? defaultLimit);

  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.floor(rawLimit)
      : defaultLimit;
  const totalPages = limit > 0 ? Math.max(1, Math.ceil(totalCount / limit)) : 1;

  const pageBase =
    Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const page = clamp(pageBase, 1, totalPages);
  const offset = limit > 0 ? (page - 1) * limit : 0;

  const updateSearchParams = useCallback(
    (
      updater: (params: URLSearchParams) => void,
      replace: boolean | undefined
    ) => {
      const params = new URLSearchParams(searchParams);
      updater(params);
      setSearchParams(params, { replace: replace ?? replaceHistory });
    },
    [replaceHistory, searchParams, setSearchParams]
  );

  const setPage = useCallback(
    (nextPage: number, opts?: { replace?: boolean }) => {
      const target = clamp(nextPage, 1, totalPages);
      updateSearchParams((params) => {
        if (target <= 1) {
          params.delete("page");
        } else {
          params.set("page", String(target));
        }
      }, opts?.replace);
    },
    [totalPages, updateSearchParams]
  );

  const setLimit = useCallback(
    (
      nextLimit: number,
      opts?: { replace?: boolean; preservePage?: boolean }
    ) => {
      const safeLimit =
        Number.isFinite(nextLimit) && nextLimit > 0
          ? Math.floor(nextLimit)
          : defaultLimit;

      updateSearchParams((params) => {
        if (safeLimit === defaultLimit) {
          params.delete("limit");
        } else {
          params.set("limit", String(safeLimit));
        }

        if (opts?.preservePage) {
          const recalculatedTotal =
            safeLimit > 0 ? Math.max(1, Math.ceil(totalCount / safeLimit)) : 1;
          const recalculatedPage = clamp(page, 1, recalculatedTotal);
          if (recalculatedPage <= 1) {
            params.delete("page");
          } else {
            params.set("page", String(recalculatedPage));
          }
        } else {
          params.delete("page");
        }
      }, opts?.replace);
    },
    [defaultLimit, page, totalCount, updateSearchParams]
  );

  useEffect(() => {
    if (pageBase !== page) {
      setPage(page);
    }
  }, [pageBase, page, setPage]);

  const paginationProps = useMemo<PaginationProps>(
    () => ({
      current: page,
      totalPages,
      onPage: setPage,
    }),
    [page, setPage, totalPages]
  );

  return {
    page,
    limit,
    offset,
    totalPages,
    setPage,
    setLimit,
    paginationProps,
  };
}
