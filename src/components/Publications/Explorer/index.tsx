'use client';

import Avatar from '@/components/Utility/Avatar';
import PublicationPost from '@/components/Utility/PublicationPost';
import { PublicationData } from '@/lib/publications';
import { Check, Filter, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

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

const DEFAULT_FILTER_VALUE = 'all';

const PublicationExplorer = ({
  publications,
  members
}: PublicationExplorerProps) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] =
    useState<string>(DEFAULT_FILTER_VALUE);
  const [selectedAuthorId, setSelectedAuthorId] =
    useState<string>(DEFAULT_FILTER_VALUE);
  const [isPortalReady, setIsPortalReady] = useState(false);

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

  const authorOptions = useMemo(() => {
    return members
      .map((member) => {
        const matcher = memberMatchers[member.id];
        const hasExplicitPublication = publications.some((publication) =>
          publication.memberIds.includes(member.id)
        );
        const hasHeuristicPublication =
          !hasExplicitPublication &&
          matcher &&
          publications.some(
            (publication) =>
              publication.memberIds.length === 0 && matcher(publication.author)
          );

        return {
          ...member,
          hasPublication:
            hasExplicitPublication || Boolean(hasHeuristicPublication),
          hasExplicitPublication
        };
      })
      .sort((a, b) => {
        if (a.hasPublication === b.hasPublication) {
          if (a.hasExplicitPublication === b.hasExplicitPublication) {
            return a.name.localeCompare(b.name);
          }
          return a.hasExplicitPublication ? -1 : 1;
        }
        return a.hasPublication ? -1 : 1;
      });
  }, [members, publications, memberMatchers]);

  const filteredPublications = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery);
    const activeMemberMatcher =
      selectedAuthorId !== DEFAULT_FILTER_VALUE
        ? memberMatchers[selectedAuthorId]
        : null;

    return publications.filter((publication) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          publication.title,
          publication.author,
          publication.journal,
          publication.catalog,
          publication.doi
        ]
          .filter(Boolean)
          .some((field) => normalizeText(field).includes(normalizedQuery));

      const matchesYear =
        selectedYear === DEFAULT_FILTER_VALUE ||
        (publication.year &&
          publication.year.toString() === selectedYear.toString());

      const matchesAuthor =
        selectedAuthorId === DEFAULT_FILTER_VALUE ||
        publication.memberIds.includes(selectedAuthorId) ||
        (!publication.memberIds.length &&
          activeMemberMatcher &&
          activeMemberMatcher(publication.author));

      return matchesQuery && matchesYear && matchesAuthor;
    });
  }, [
    publications,
    searchQuery,
    selectedYear,
    selectedAuthorId,
    memberMatchers
  ]);

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

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count += 1;
    if (selectedYear !== DEFAULT_FILTER_VALUE) count += 1;
    if (selectedAuthorId !== DEFAULT_FILTER_VALUE) count += 1;
    return count;
  }, [searchQuery, selectedYear, selectedAuthorId]);

  const selectedAuthor =
    selectedAuthorId !== DEFAULT_FILTER_VALUE
      ? membersById[selectedAuthorId]
      : null;

  const closeOverlay = () => setIsOverlayOpen(false);
  const openOverlay = () => setIsOverlayOpen(true);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedYear(DEFAULT_FILTER_VALUE);
    setSelectedAuthorId(DEFAULT_FILTER_VALUE);
  };

  const handleAuthorSelect = (memberId: string) => {
    setSelectedAuthorId((current) =>
      current === memberId ? DEFAULT_FILTER_VALUE : memberId
    );
  };

  useEffect(() => {
    if (!isOverlayOpen) {
      document.body.style.removeProperty('overflow');
      return;
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeOverlay();
      }
    };

    document.body.style.setProperty('overflow', 'hidden');
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.body.style.removeProperty('overflow');
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [isOverlayOpen]);

  useEffect(() => {
    setIsPortalReady(true);
  }, []);

  return (
    <div className="mt-16 space-y-10">
      <div>
        <button
          type="button"
          onClick={openOverlay}
          className="flex w-full items-center justify-between rounded-3xl border border-black/5 bg-white/80 px-5 py-4 text-left text-ink-700 shadow-[0_18px_42px_-28px_rgba(15,15,35,0.35)] transition duration-300 hover:border-black/10 hover:bg-white"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-ink-700">
              <Search size={20} />
            </span>
            <div className="flex flex-col">
              <span className="text-sm uppercase tracking-[0.22em] text-ink-400">
                Search publications
              </span>
              <span className="text-base font-medium text-ink-700">
                {searchQuery
                  ? `“${searchQuery}”`
                  : 'Filter by keyword, author, or journal'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-ink-400">
            <Filter size={16} />
            {activeFiltersCount > 0 ? (
              <span>{activeFiltersCount} active</span>
            ) : (
              <span>Open</span>
            )}
          </div>
        </button>

        {(searchQuery ||
          selectedYear !== DEFAULT_FILTER_VALUE ||
          selectedAuthorId !== DEFAULT_FILTER_VALUE) && (
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-ink-600">
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
                label={`Author: ${selectedAuthor.name}`}
                onClear={() => setSelectedAuthorId(DEFAULT_FILTER_VALUE)}
              />
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="ml-2 text-sm font-medium text-ink-500 hover:text-ink-700"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {filteredPublications.length > 0 ? (
          filteredPublications.map((publication) => (
            <PublicationPost key={publication.id} {...publication} />
          ))
        ) : (
          <div className="rounded-3xl border border-black/5 bg-white/70 p-8 text-center text-sm text-ink-500">
            No publications match your filters right now. Try adjusting your
            search or selecting a different author or year.
          </div>
        )}
      </div>

      {isOverlayOpen &&
        isPortalReady &&
        createPortal(
          <PublicationOverlay
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedAuthorId={selectedAuthorId}
            onAuthorSelect={handleAuthorSelect}
            authorOptions={authorOptions}
            yearOptions={yearOptions}
            onClose={closeOverlay}
            onReset={resetFilters}
          />,
          document.body
        )}
    </div>
  );
};

type OverlayProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedYear: string;
  setSelectedYear: (value: string) => void;
  selectedAuthorId: string;
  onAuthorSelect: (memberId: string) => void;
  authorOptions: Array<
    MemberOption & { hasPublication: boolean; hasExplicitPublication: boolean }
  >;
  yearOptions: number[];
  onClose: () => void;
  onReset: () => void;
};

const PublicationOverlay = ({
  searchQuery,
  setSearchQuery,
  selectedYear,
  setSelectedYear,
  selectedAuthorId,
  onAuthorSelect,
  authorOptions,
  yearOptions,
  onClose,
  onReset
}: OverlayProps) => {
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>(
        '#publication-search-input'
      );
      input?.focus();
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-10 md:px-8">
      <div
        className="absolute inset-0 bg-ink-900/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-black/10 bg-white/95 shadow-[0_48px_120px_-32px_rgba(10,10,40,0.45)]">
        <header className="flex items-center justify-between border-b border-black/5 px-6 py-4 md:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink-400">
              Publication search
            </p>
            <p className="mt-1 text-lg font-semibold text-ink-800">
              Refine what you are looking for
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-ink-500 transition duration-200 hover:border-black/20 hover:text-ink-700"
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 pb-6 pt-6 md:px-8">
          <div className="space-y-3">
            <label
              htmlFor="publication-search-input"
              className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-500"
            >
              Keywords
            </label>
            <div className="relative flex items-center">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 text-ink-300"
              />
              <input
                id="publication-search-input"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search title, journal, authors, DOI…"
                className="w-full rounded-2xl border border-black/10 bg-white px-11 py-4 text-sm text-ink-800 shadow-[0_22px_50px_-32px_rgba(10,10,40,0.35)] outline-none transition duration-200 placeholder:text-ink-300 focus:border-black/30 focus:shadow-[0_30px_70px_-28px_rgba(10,10,40,0.45)]"
              />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <label
                htmlFor="publication-year-select"
                className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-500"
              >
                Year
              </label>
              <select
                id="publication-year-select"
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-ink-800 shadow-[0_18px_42px_-28px_rgba(10,10,40,0.28)] outline-none transition duration-200 focus:border-black/30"
              >
                <option value={DEFAULT_FILTER_VALUE}>All years</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-500">
                Author
              </p>
              <div className="grid max-h-64 gap-3 overflow-y-auto pr-1">
                {authorOptions.map((member) => {
                  const isSelected = selectedAuthorId === member.id;
                  const isDisabled = !member.hasPublication;

                  return (
                    <button
                      key={member.id}
                      type="button"
                      className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition duration-200 ${
                        isSelected
                          ? 'border-ink-800 bg-ink-800/5 text-ink-900'
                          : 'border-black/10 bg-white text-ink-700 hover:border-black/25 hover:bg-white'
                      } ${isDisabled ? 'opacity-50 hover:border-black/10 hover:bg-white cursor-not-allowed' : ''}`}
                      onClick={() => !isDisabled && onAuthorSelect(member.id)}
                      disabled={isDisabled}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={member.thumbnail}
                          size={48}
                          alt={`${member.name} portrait`}
                          className="border-black/10 ring-black/5 shadow-none"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">
                            {member.name}
                          </span>
                          {member.title && (
                            <span className="text-[0.68rem] text-ink-500">
                              {member.title}
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <Check size={16} className="ml-auto text-ink-700" />
                      )}
                    </button>
                  );
                })}
                {authorOptions.length === 0 && (
                  <p className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-ink-500">
                    No SDSC members are listed yet. Publications will surface
                    matching authors automatically once profiles are added.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-black/5 px-6 py-4 md:px-8">
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-semibold text-ink-500 hover:text-ink-700"
          >
            Reset filters
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white transition duration-200 hover:bg-black"
          >
            View results
          </button>
        </footer>
      </div>
    </div>
  );
};

type FilterChipProps = {
  label: string;
  onClear: () => void;
};

const FilterChip = ({ label, onClear }: FilterChipProps) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-2 text-xs text-ink-600">
    {label}
    <button
      type="button"
      onClick={onClear}
      className="rounded-full border border-black/10 p-1 text-ink-400 hover:border-black/20 hover:text-ink-700"
      aria-label={`Remove ${label}`}
    >
      <X size={12} />
    </button>
  </span>
);

function normalizeText(value?: string | null) {
  return value?.toLowerCase().trim() || '';
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
