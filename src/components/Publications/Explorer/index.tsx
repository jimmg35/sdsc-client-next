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
  useRef,
  useState
} from 'react';
import { useTranslations } from 'next-intl';
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
const PUBLICATIONS_PER_PAGE = 5;
const SORT_OPTIONS: Array<{ key: string; value: SortValue }> = [
  { key: 'yearDesc', value: 'year-desc' },
  { key: 'yearAsc', value: 'year-asc' },
  { key: 'authorAsc', value: 'author-asc' },
  { key: 'authorDesc', value: 'author-desc' }
];

const PublicationExplorer = ({
  publications,
  members
}: PublicationExplorerProps) => {
  const t = useTranslations('publications');
  const tCommon = useTranslations('common');
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
  const filterSignature = JSON.stringify([
    deferredSearchQuery,
    selectedYear,
    selectedAuthorId
  ]);
  const previousFilterSignatureRef = useRef(filterSignature);

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
    if (previousFilterSignatureRef.current === filterSignature) {
      return;
    }

    previousFilterSignatureRef.current = filterSignature;

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
    filterSignature,
    pathname,
    router,
    searchParamsString,
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
      <section
        id="publication-finder"
        className="relative scroll-mt-36 border-y border-accent-600/25 py-7 md:scroll-mt-44"
      >
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-accent-700">
                <Sparkles size={14} aria-hidden />
                {t('finder.chip')}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-200/80 bg-surface/82 px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.24em] text-ink-500">
                <Filter size={14} />
                {activeFiltersCount
                  ? t('finder.filtersActive', { count: activeFiltersCount })
                  : t('finder.browseArchive')}
              </span>
              <span className="inline-flex items-center rounded-full border border-accent-600/25 bg-surface/80 px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-ink-500">
                {t('finder.results', { count: sortedRecords.length })}
              </span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label
                htmlFor="publication-sort-select"
                className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-ink-500"
              >
                <SlidersHorizontal size={14} />
                {t('finder.sort')}
              </label>
              <select
                id="publication-sort-select"
                value={sortValue}
                onChange={(event) =>
                  handleSortChange(event.target.value as SortValue)
                }
                className="calcite-focus rounded-full border border-accent-600/30 bg-surface/80 px-4 py-2.5 text-sm font-medium text-ink-900"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`sortOptions.${option.key}`)}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 rounded-full border border-accent-600/30 bg-surface/80 px-4 py-2.5 text-sm font-semibold text-ink-700 transition duration-200 hover:border-primary-300/60 hover:text-primary-600"
              >
                <RotateCcw size={15} />
                {t('finder.reset')}
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-500"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('search.placeholder')}
                className="calcite-focus w-full rounded-full border border-accent-600/30 bg-surface/80 py-3.5 pl-13 pr-5 text-[0.97rem] text-ink-900 transition-colors duration-300 hover:border-accent-600/45 placeholder:text-ink-500"
              />
            </div>
          </div>

          {(searchQuery ||
            selectedYear !== DEFAULT_FILTER_VALUE ||
            selectedAuthorId !== DEFAULT_FILTER_VALUE) && (
            <div className="flex flex-wrap items-center gap-3">
              {searchQuery && (
                <FilterChip
                  label={t('chips.keyword', { value: searchQuery })}
                  removeLabel={t('chips.remove', {
                    label: t('chips.keyword', { value: searchQuery })
                  })}
                  onClear={() => setSearchQuery('')}
                />
              )}
              {selectedYear !== DEFAULT_FILTER_VALUE && (
                <FilterChip
                  label={t('chips.year', { value: selectedYear })}
                  removeLabel={t('chips.remove', {
                    label: t('chips.year', { value: selectedYear })
                  })}
                  onClear={() => setSelectedYear(DEFAULT_FILTER_VALUE)}
                />
              )}
              {selectedAuthor && (
                <FilterChip
                  label={t('chips.author', { value: selectedAuthor.name })}
                  removeLabel={t('chips.remove', {
                    label: t('chips.author', { value: selectedAuthor.name })
                  })}
                  onClear={() => setSelectedAuthorId(DEFAULT_FILTER_VALUE)}
                />
              )}
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[285px_minmax(0,1fr)]">
        <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          <div
            id="publication-years"
            className="scroll-mt-36 border-t border-accent-600/25 pt-6 md:scroll-mt-44"
          >
            <div className="space-y-4">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-primary-500">
                  {t('filters.byYear')}
                </p>
                <p className="mt-2 text-sm text-ink-500">
                  {t('filters.byYearHint')}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <YearFilterButton
                  label={t('filters.allYears')}
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

          <div
            id="publication-members"
            className="scroll-mt-36 border-t border-accent-600/25 pt-6 md:scroll-mt-44"
          >
            <div className="space-y-4">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-primary-500">
                  {t('filters.byMember')}
                </p>
                <p className="mt-2 text-sm text-ink-500">
                  {t('filters.byMemberHint')}
                </p>
              </div>

              <div className="grid max-h-[28rem] gap-2 overflow-y-auto pr-1">
                <AuthorFilterButton
                  label={t('filters.allMembers')}
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
                        ? 'border-primary-300/70 bg-primary-50/75 text-ink-900 shadow-glow'
                        : 'border-accent-600/25 bg-surface/80 text-ink-700 hover:border-accent-600/45 hover:bg-surface'
                    } ${
                      !member.hasPublication
                        ? 'cursor-not-allowed opacity-45 hover:border-accent-600/25 hover:bg-surface/80'
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

        <div
          id="publication-results"
          className="space-y-6 scroll-mt-36 md:scroll-mt-44"
        >
          <div className="flex flex-col gap-3 border-b border-accent-600/25 pb-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-ink-900">
                {sortedRecords.length
                  ? t('results.showing', {
                      start: pageStart,
                      end: pageEnd,
                      total: sortedRecords.length
                    })
                  : t('results.noMatch')}
              </p>
              <p className="text-xs uppercase tracking-[0.28em] text-ink-500">
                {t('results.eachCard')}
              </p>
            </div>

            <div className="text-sm text-ink-500">
              {t.rich('results.queryParams', {
                b: (chunks) => <span className="font-semibold">{chunks}</span>
              })}
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
              <div className="border-t border-accent-600/25 py-12 text-sm text-ink-500">
                {t('results.empty')}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label={t('pagination.aria')}
              className="flex flex-col gap-4 border-t border-accent-600/25 pt-7"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    {t('pagination.pageOf', {
                      current: currentPage,
                      total: totalPages
                    })}
                  </p>
                  <p className="text-xs uppercase tracking-[0.28em] text-ink-500">
                    {t('pagination.navigate')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <PaginationButton
                    label={tCommon('previous')}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    icon={<ArrowLeft size={16} />}
                  />

                  {paginationItems.map((item, index) =>
                    item === 'ellipsis' ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 text-sm text-ink-500"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handlePageChange(item)}
                        aria-current={item === currentPage ? 'page' : undefined}
                        className={`min-w-11 cursor-pointer rounded-[20px] border px-4 py-3 text-sm font-semibold transition duration-200 ${
                          item === currentPage
                            ? 'border-primary-400/70 bg-primary-500 text-white shadow-glow-lg'
                            : 'border-accent-600/25 bg-surface/85 text-ink-700 hover:border-accent-600/45 hover:bg-surface'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                  <PaginationButton
                    label={tCommon('next')}
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
  removeLabel: string;
  onClear: () => void;
};

const FilterChip = ({ label, removeLabel, onClear }: FilterChipProps) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-primary-200/60 bg-primary-50/80 px-3 py-2 text-xs font-medium text-ink-700">
    {label}
    <button
      type="button"
      onClick={onClear}
      className="rounded-full border border-primary-200/70 p-1 text-primary-500 transition duration-200 hover:border-primary-300 hover:text-primary-600"
      aria-label={removeLabel}
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
        ? 'border-primary-300/70 bg-primary-50 text-primary-700 shadow-glow'
        : 'border-accent-600/25 bg-surface/82 text-ink-700 hover:border-primary-300/60 hover:bg-surface'
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
        ? 'border-primary-300/70 bg-primary-50/78 text-ink-900 shadow-glow'
        : 'border-accent-600/25 bg-surface/84 text-ink-700 hover:border-primary-300/60 hover:bg-surface'
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
        ? 'cursor-not-allowed border-accent-600/25 bg-surface/70 text-ink-300'
        : 'cursor-pointer border-accent-600/25 bg-surface/85 text-ink-700 hover:border-accent-600/45 hover:bg-surface'
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
