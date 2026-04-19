'use client';

import Avatar from '@/components/Utility/Avatar';
import PublicationPost, {
  PublicationCardMember
} from '@/components/Utility/PublicationPost';
import { PublicationData } from '@/lib/publications';
import {
  ArrowLeft,
  ArrowRight,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X
} from 'lucide-react';
import {
  ReactNode,
  useDeferredValue,
  useEffect,
  useMemo,
  useState
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type MemberOption = {
  id: string;
  name: string;
  title?: string;
  thumbnail: string;
};

type PublicationExplorerProps = {
  publications: PublicationData[];
  members: MemberOption[];
};

type SortValue = 'year-desc' | 'year-asc' | 'author-asc' | 'author-desc';
type HistoryMode = 'push' | 'replace';

type PublicationRecord = {
  publication: PublicationData;
  centerMembers: PublicationCardMember[];
  searchableText: string;
};

const DEFAULT_FILTER_VALUE = 'all';
const DEFAULT_SORT_VALUE: SortValue = 'year-desc';
const PUBLICATIONS_PER_PAGE = 12;
const SORT_OPTIONS: Array<{ label: string; value: SortValue }> = [
  { label: 'Newest year first', value: 'year-desc' },
  { label: 'Oldest year first', value: 'year-asc' },
  { label: 'Author name A-Z', value: 'author-asc' },
  { label: 'Author name Z-A', value: 'author-desc' }
];

const PublicationExplorer = ({
  publications,
  members
}: PublicationExplorerProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [selectedYear, setSelectedYear] =
    useState<string>(DEFAULT_FILTER_VALUE);
  const [selectedAuthorId, setSelectedAuthorId] =
    useState<string>(DEFAULT_FILTER_VALUE);

  const pageParam = searchParams.get('page');
  const sortParam = searchParams.get('sort');
  const sortValue = isSortValue(sortParam) ? sortParam : DEFAULT_SORT_VALUE;
  const parsedPage = Number.parseInt(pageParam ?? '1', 10);
  const currentPageFromUrl =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const yearOptions = useMemo(() => {
    const uniqueYears = new Set<number>();
    publications.forEach((publication) => {
      if (publication.year) {
        uniqueYears.add(publication.year);
      }
    });
    return Array.from(uniqueYears).sort((a, b) => b - a);
  }, [publications]);

  const membersById = useMemo(() => {
    return members.reduce<Record<string, MemberOption>>((acc, member) => {
      acc[member.id] = member;
      return acc;
    }, {});
  }, [members]);

  const memberMatchers = useMemo(() => {
    return members.reduce<Record<string, (authorField: string) => boolean>>(
      (acc, member) => {
        const matcher = buildMemberMatcher(member.name);
        if (matcher) {
          acc[member.id] = matcher;
        }
        return acc;
      },
      {}
    );
  }, [members]);

  const publicationRecords = useMemo<PublicationRecord[]>(() => {
    return publications.map((publication) => {
      const explicitMembers = publication.memberIds
        .map((memberId) => membersById[memberId])
        .filter((member): member is MemberOption => Boolean(member));

      const heuristicMembers =
        publication.memberIds.length === 0
          ? members.filter((member) => {
              const matcher = memberMatchers[member.id];
              return matcher ? matcher(publication.author) : false;
            })
          : [];

      const centerMembers = Array.from(
        new Map(
          [...explicitMembers, ...heuristicMembers].map((member) => [
            member.id,
            {
              id: member.id,
              name: member.name,
              thumbnail: member.thumbnail
            }
          ])
        ).values()
      );

      return {
        publication,
        centerMembers,
        searchableText: normalizeText(
          [
            publication.title,
            publication.journal,
            publication.catalog,
            publication.doi,
            publication.author,
            ...centerMembers.map((member) => member.name)
          ]
            .filter(Boolean)
            .join(' ')
        )
      };
    });
  }, [memberMatchers, members, membersById, publications]);

  const authorOptions = useMemo(() => {
    return members
      .map((member) => ({
        ...member,
        hasPublication: publicationRecords.some((record) =>
          record.centerMembers.some(
            (centerMember) => centerMember.id === member.id
          )
        )
      }))
      .sort((left, right) => {
        if (left.hasPublication === right.hasPublication) {
          return left.name.localeCompare(right.name);
        }
        return left.hasPublication ? -1 : 1;
      });
  }, [members, publicationRecords]);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = normalizeText(deferredSearchQuery);

    return publicationRecords.filter(
      ({ publication, centerMembers, searchableText }) => {
        const matchesQuery =
          !normalizedQuery || searchableText.includes(normalizedQuery);

        const matchesYear =
          selectedYear === DEFAULT_FILTER_VALUE ||
          (publication.year &&
            publication.year.toString() === selectedYear.toString());

        const matchesAuthor =
          selectedAuthorId === DEFAULT_FILTER_VALUE ||
          centerMembers.some((member) => member.id === selectedAuthorId);

        return matchesQuery && matchesYear && matchesAuthor;
      }
    );
  }, [deferredSearchQuery, publicationRecords, selectedAuthorId, selectedYear]);

  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((left, right) =>
      comparePublications(left.publication, right.publication, sortValue)
    );
  }, [filteredRecords, sortValue]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedRecords.length / PUBLICATIONS_PER_PAGE)
  );
  const currentPage = Math.min(currentPageFromUrl, totalPages);
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * PUBLICATIONS_PER_PAGE;
    return sortedRecords.slice(startIndex, startIndex + PUBLICATIONS_PER_PAGE);
  }, [currentPage, sortedRecords]);

  const paginationItems = useMemo(
    () => buildPaginationItems(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count += 1;
    if (selectedYear !== DEFAULT_FILTER_VALUE) count += 1;
    if (selectedAuthorId !== DEFAULT_FILTER_VALUE) count += 1;
    return count;
  }, [searchQuery, selectedAuthorId, selectedYear]);

  const selectedAuthor =
    selectedAuthorId !== DEFAULT_FILTER_VALUE
      ? membersById[selectedAuthorId]
      : null;

  const pageStart = sortedRecords.length
    ? (currentPage - 1) * PUBLICATIONS_PER_PAGE + 1
    : 0;
  const pageEnd = sortedRecords.length
    ? Math.min(currentPage * PUBLICATIONS_PER_PAGE, sortedRecords.length)
    : 0;

  useEffect(() => {
    if (
      selectedAuthorId !== DEFAULT_FILTER_VALUE &&
      !authorOptions.some(
        (option) => option.id === selectedAuthorId && option.hasPublication
      )
    ) {
      setSelectedAuthorId(DEFAULT_FILTER_VALUE);
    }
  }, [authorOptions, selectedAuthorId]);

  useEffect(() => {
    if (pageParam === String(currentPage) && sortParam === sortValue) {
      return;
    }

    syncQuery({
      pathname,
      router,
      searchParamsString,
      updates: {
        page: String(currentPage),
        sort: sortValue
      }
    });
  }, [
    currentPage,
    pageParam,
    pathname,
    router,
    searchParamsString,
    sortParam,
    sortValue
  ]);

  useEffect(() => {
    if (currentPage === 1) {
      return;
    }

    syncQuery({
      pathname,
      router,
      searchParamsString,
      updates: { page: '1', sort: sortValue },
      historyMode: 'replace'
    });
  }, [
    currentPage,
    pathname,
    router,
    searchParamsString,
    searchQuery,
    selectedAuthorId,
    selectedYear,
    sortValue
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedYear(DEFAULT_FILTER_VALUE);
    setSelectedAuthorId(DEFAULT_FILTER_VALUE);
  };

  const handleSortChange = (nextSortValue: SortValue) => {
    syncQuery({
      pathname,
      router,
      searchParamsString,
      updates: {
        page: '1',
        sort: nextSortValue
      },
      historyMode: 'push'
    });
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) {
      return;
    }

    syncQuery({
      pathname,
      router,
      searchParamsString,
      updates: {
        page: String(nextPage),
        sort: sortValue
      },
      historyMode: 'push'
    });
  };

  return (
    <div className="mt-16 space-y-8">
      <section className="calcite-box relative overflow-hidden px-5 py-5 md:px-6 md:py-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_82%_-12%,_rgba(214,167,208,0.26),_transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_12%_0%,_rgba(194,156,106,0.18),_transparent_50%)]" />

        <div className="relative flex flex-col gap-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="chip-gold py-1">
                <Sparkles size={14} />
                Publication Finder
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-silk-200/80 bg-white/82 px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.24em] text-ink-500">
                <Filter size={14} />
                {activeFiltersCount
                  ? `${activeFiltersCount} filters active`
                  : 'Browse the archive'}
              </span>
              <span className="inline-flex items-center rounded-full border border-black/6 bg-white/80 px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-ink-500">
                {sortedRecords.length} results
              </span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label
                htmlFor="publication-sort-select"
                className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-ink-400"
              >
                <SlidersHorizontal size={14} />
                Sort
              </label>
              <select
                id="publication-sort-select"
                value={sortValue}
                onChange={(event) =>
                  handleSortChange(event.target.value as SortValue)
                }
                className="calcite-focus rounded-[20px] border border-black/8 bg-white/88 px-4 py-3 text-sm font-medium text-ink-800"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/86 px-4 py-3 text-sm font-semibold text-ink-700 transition duration-200 hover:border-black/20 hover:bg-white"
              >
                <RotateCcw size={15} />
                Reset
              </button>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by title, journal, DOI, or SDSC member"
                className="calcite-focus w-full rounded-[24px] border border-black/8 bg-white/88 py-3.5 pl-13 pr-5 text-[0.97rem] text-ink-900 shadow-[0_22px_48px_-36px_rgba(44,36,32,0.24)] placeholder:text-ink-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-black/6 bg-[linear-gradient(175deg,rgba(255,255,255,0.9),rgba(250,244,237,0.82))] px-4 py-3 text-sm text-ink-600 shadow-[0_20px_44px_-36px_rgba(44,36,32,0.22)]">
              <span className="font-semibold text-ink-800">
                {sortedRecords.length
                  ? `Showing ${pageStart}-${pageEnd} of ${sortedRecords.length}`
                  : '0 results'}
              </span>
              <span className="text-ink-400">/</span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>

          {(searchQuery ||
            selectedYear !== DEFAULT_FILTER_VALUE ||
            selectedAuthorId !== DEFAULT_FILTER_VALUE) && (
            <div className="flex flex-wrap items-center gap-3">
              {searchQuery && (
                <FilterChip
                  label={`Keyword: ${searchQuery}`}
                  onClear={() => setSearchQuery('')}
                />
              )}
              {selectedYear !== DEFAULT_FILTER_VALUE && (
                <FilterChip
                  label={`Year: ${selectedYear}`}
                  onClear={() => setSelectedYear(DEFAULT_FILTER_VALUE)}
                />
              )}
              {selectedAuthor && (
                <FilterChip
                  label={`SDSC Author: ${selectedAuthor.name}`}
                  onClear={() => setSelectedAuthorId(DEFAULT_FILTER_VALUE)}
                />
              )}
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[285px_minmax(0,1fr)]">
        <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          <div className="calcite-box px-5 py-5">
            <div className="space-y-4">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-rose-500">
                  Filter by Year
                </p>
                <p className="mt-2 text-sm text-ink-500">
                  Keep the timeline tight when you want the latest or earliest
                  work first.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <YearFilterButton
                  label="All years"
                  active={selectedYear === DEFAULT_FILTER_VALUE}
                  onClick={() => setSelectedYear(DEFAULT_FILTER_VALUE)}
                />
                {yearOptions.map((year) => (
                  <YearFilterButton
                    key={year}
                    label={String(year)}
                    active={selectedYear === String(year)}
                    onClick={() => setSelectedYear(String(year))}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="calcite-box px-5 py-5">
            <div className="space-y-4">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-rose-500">
                  Filter by SDSC Member
                </p>
                <p className="mt-2 text-sm text-ink-500">
                  Select a center member to narrow the archive to publications
                  they contributed to.
                </p>
              </div>

              <div className="grid max-h-[28rem] gap-2 overflow-y-auto pr-1">
                <AuthorFilterButton
                  label="All SDSC members"
                  active={selectedAuthorId === DEFAULT_FILTER_VALUE}
                  onClick={() => setSelectedAuthorId(DEFAULT_FILTER_VALUE)}
                />
                {authorOptions.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setSelectedAuthorId(member.id)}
                    disabled={!member.hasPublication}
                    className={`flex items-center gap-3 rounded-[22px] border px-3 py-3 text-left transition duration-200 ${
                      selectedAuthorId === member.id
                        ? 'border-rose-300/70 bg-rose-50/75 text-ink-900 shadow-[0_20px_40px_-34px_rgba(168,110,161,0.45)]'
                        : 'border-black/7 bg-white/80 text-ink-700 hover:border-black/12 hover:bg-white'
                    } ${
                      !member.hasPublication
                        ? 'cursor-not-allowed opacity-45 hover:border-black/7 hover:bg-white/80'
                        : ''
                    }`}
                  >
                    <Avatar
                      src={member.thumbnail}
                      size={46}
                      alt={`${member.name} portrait`}
                      variant="soft"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {member.name}
                      </p>
                      {member.title && (
                        <p className="truncate text-[0.7rem] text-ink-500">
                          {member.title}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-col gap-3 rounded-[30px] border border-black/6 bg-white/72 px-5 py-4 shadow-[0_24px_54px_-38px_rgba(44,36,32,0.18)] md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-ink-800">
                {sortedRecords.length
                  ? `Showing ${pageStart}-${pageEnd} of ${sortedRecords.length} publications`
                  : 'No publications match the current query'}
              </p>
              <p className="text-xs uppercase tracking-[0.28em] text-ink-400">
                Each card highlights only SDSC contributors
              </p>
            </div>

            <div className="text-sm text-ink-500">
              Query params: <span className="font-semibold">page</span>,{' '}
              <span className="font-semibold">sort</span>
            </div>
          </div>

          <div className="grid gap-6">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map(({ publication, centerMembers }) => (
                <PublicationPost
                  key={publication.id}
                  {...publication}
                  centerMembers={centerMembers}
                />
              ))
            ) : (
              <div className="calcite-box px-8 py-10 text-center text-sm text-ink-500">
                No publications match your current search and filter
                combination. Try clearing a filter or broadening the keyword.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Publication pagination"
              className="calcite-box flex flex-col gap-4 px-5 py-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink-800">
                    Page {currentPage} of {totalPages}
                  </p>
                  <p className="text-xs uppercase tracking-[0.28em] text-ink-400">
                    Navigate the publication archive
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <PaginationButton
                    label="Previous"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    icon={<ArrowLeft size={16} />}
                  />

                  {paginationItems.map((item, index) =>
                    item === 'ellipsis' ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 text-sm text-ink-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handlePageChange(item)}
                        aria-current={item === currentPage ? 'page' : undefined}
                        className={`min-w-11 rounded-[20px] border px-4 py-3 text-sm font-semibold transition duration-200 ${
                          item === currentPage
                            ? 'border-rose-400/70 bg-rose-500 text-white shadow-[0_24px_40px_-30px_rgba(168,110,161,0.6)]'
                            : 'border-black/8 bg-white/85 text-ink-700 hover:border-black/16 hover:bg-white'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                  <PaginationButton
                    label="Next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    icon={<ArrowRight size={16} />}
                    iconPosition="right"
                  />
                </div>
              </div>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

type FilterChipProps = {
  label: string;
  onClear: () => void;
};

const FilterChip = ({ label, onClear }: FilterChipProps) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-rose-200/60 bg-rose-50/80 px-3 py-2 text-xs font-medium text-ink-700">
    {label}
    <button
      type="button"
      onClick={onClear}
      className="rounded-full border border-rose-200/70 p-1 text-rose-500 transition duration-200 hover:border-rose-300 hover:text-rose-600"
      aria-label={`Remove ${label}`}
    >
      <X size={12} />
    </button>
  </span>
);

type YearFilterButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

const YearFilterButton = ({
  label,
  active,
  onClick
}: YearFilterButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-3.5 py-2 text-sm font-medium transition duration-200 ${
      active
        ? 'border-rose-300/70 bg-rose-50 text-rose-700 shadow-[0_16px_30px_-24px_rgba(168,110,161,0.4)]'
        : 'border-black/8 bg-white/82 text-ink-700 hover:border-black/14 hover:bg-white'
    }`}
  >
    {label}
  </button>
);

type AuthorFilterButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

const AuthorFilterButton = ({
  label,
  active,
  onClick
}: AuthorFilterButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-[22px] border px-4 py-3 text-left text-sm font-semibold transition duration-200 ${
      active
        ? 'border-rose-300/70 bg-rose-50/78 text-ink-900 shadow-[0_20px_36px_-30px_rgba(168,110,161,0.45)]'
        : 'border-black/8 bg-white/84 text-ink-700 hover:border-black/14 hover:bg-white'
    }`}
  >
    {label}
  </button>
);

type PaginationButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
};

const PaginationButton = ({
  label,
  onClick,
  disabled = false,
  icon,
  iconPosition = 'left'
}: PaginationButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-2 rounded-[20px] border px-4 py-3 text-sm font-semibold transition duration-200 ${
      disabled
        ? 'cursor-not-allowed border-black/6 bg-white/70 text-ink-300'
        : 'border-black/8 bg-white/85 text-ink-700 hover:border-black/16 hover:bg-white'
    }`}
  >
    {iconPosition === 'left' && icon}
    {label}
    {iconPosition === 'right' && icon}
  </button>
);

function syncQuery({
  pathname,
  router,
  searchParamsString,
  updates,
  historyMode = 'replace'
}: {
  pathname: string;
  router: ReturnType<typeof useRouter>;
  searchParamsString: string;
  updates: Record<string, string | null>;
  historyMode?: HistoryMode;
}) {
  const nextParams = new URLSearchParams(searchParamsString);

  Object.entries(updates).forEach(([key, value]) => {
    if (!value) {
      nextParams.delete(key);
      return;
    }

    nextParams.set(key, value);
  });

  const queryString = nextParams.toString();
  const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
  const currentUrl = searchParamsString
    ? `${pathname}?${searchParamsString}`
    : pathname;

  if (nextUrl === currentUrl) {
    return;
  }

  if (historyMode === 'push') {
    router.push(nextUrl);
    return;
  }

  router.replace(nextUrl);
}

function normalizeText(value?: string | null) {
  return value?.toLowerCase().trim() || '';
}

function isSortValue(value: string | null): value is SortValue {
  return SORT_OPTIONS.some((option) => option.value === value);
}

function comparePublications(
  left: PublicationData,
  right: PublicationData,
  sortValue: SortValue
) {
  if (sortValue === 'year-desc') {
    return compareByYearDesc(left, right) || compareByTitle(left, right);
  }

  if (sortValue === 'year-asc') {
    return compareByYearAsc(left, right) || compareByTitle(left, right);
  }

  if (sortValue === 'author-asc') {
    return compareByAuthor(left, right) || compareByTitle(left, right);
  }

  return compareByAuthor(right, left) || compareByTitle(left, right);
}

function compareByYearAsc(left: PublicationData, right: PublicationData) {
  const leftHasYear = typeof left.year === 'number';
  const rightHasYear = typeof right.year === 'number';

  if (!leftHasYear && !rightHasYear) {
    return 0;
  }

  if (!leftHasYear) {
    return 1;
  }

  if (!rightHasYear) {
    return -1;
  }

  const leftYear = left.year as number;
  const rightYear = right.year as number;

  if (leftYear !== rightYear) {
    return leftYear - rightYear;
  }

  return 0;
}

function compareByYearDesc(left: PublicationData, right: PublicationData) {
  const leftHasYear = typeof left.year === 'number';
  const rightHasYear = typeof right.year === 'number';

  if (!leftHasYear && !rightHasYear) {
    return 0;
  }

  if (!leftHasYear) {
    return 1;
  }

  if (!rightHasYear) {
    return -1;
  }

  const leftYear = left.year as number;
  const rightYear = right.year as number;

  if (leftYear !== rightYear) {
    return rightYear - leftYear;
  }

  return 0;
}

function compareByAuthor(left: PublicationData, right: PublicationData) {
  return normalizeText(left.author).localeCompare(normalizeText(right.author));
}

function compareByTitle(left: PublicationData, right: PublicationData) {
  return left.title.localeCompare(right.title);
}

function buildPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | 'ellipsis'> = [1];
  let start = Math.max(2, currentPage - 1);
  let end = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= 3) {
    end = 4;
  }

  if (currentPage >= totalPages - 2) {
    start = totalPages - 3;
  }

  if (start > 2) {
    items.push('ellipsis');
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < totalPages - 1) {
    items.push('ellipsis');
  }

  items.push(totalPages);
  return items;
}

function buildMemberMatcher(name: string) {
  const normalizedName = name?.trim();
  if (!normalizedName) {
    return null;
  }

  const parts = normalizedName.split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return null;
  }

  const lastName = parts[parts.length - 1];
  const firstName = parts[0];
  const middleNames = parts.slice(1, -1);
  const firstInitial = firstName?.[0] ?? '';

  const lastNamePattern = new RegExp(`\\b${escapeRegExp(lastName)}\\b`, 'i');

  const patterns: RegExp[] = [];

  if (firstName && lastName) {
    patterns.push(
      new RegExp(
        `\\b${escapeRegExp(firstName)}\\s+${escapeRegExp(lastName)}\\b`,
        'i'
      )
    );
    patterns.push(
      new RegExp(
        `\\b${escapeRegExp(lastName)},\\s*${escapeRegExp(firstInitial)}\\b`,
        'i'
      )
    );
  }

  if (middleNames.length) {
    patterns.push(
      new RegExp(
        `\\b${escapeRegExp(firstName)}\\s+${middleNames
          .map((namePart) => escapeRegExp(namePart))
          .join('\\s+')}\\s+${escapeRegExp(lastName)}\\b`,
        'i'
      )
    );
  }

  return (authorField: string) => {
    if (!authorField) {
      return false;
    }

    if (!lastNamePattern.test(authorField)) {
      return false;
    }

    if (!patterns.length) {
      return true;
    }

    return patterns.some((pattern) => pattern.test(authorField));
  };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default PublicationExplorer;
