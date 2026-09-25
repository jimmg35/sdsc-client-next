import MembersDirectory, {
  type MemberDirectorySection
} from '@/components/Members/Directory';
import { MemberData, getMemberById } from '@/lib/members';
import { getTranslations } from 'next-intl/server';

const collectMembers = (entries: Array<MemberData | null>): MemberData[] =>
  entries.filter((entry): entry is MemberData => Boolean(entry));

const sortMembersByName = (members: MemberData[]): MemberData[] =>
  [...members].sort((left, right) =>
    left.name.localeCompare(right.name, 'en', { sensitivity: 'base' })
  );

export default async function Member() {
  const t = await getTranslations('members');

  const stewart = getMemberById('stewart-fotheringham');

  const coreMembers = collectMembers([
    getMemberById('amber-dejohn'),
    getMemberById('ziqi-li'),
    getMemberById('mark-horner'),
    getMemberById('mason-mathews'),
    getMemberById('mehak-sachdeva'),
    getMemberById('christopher-uejio')
  ]);

  const graduateStudents = collectMembers([
    getMemberById('weining-kan'),
    getMemberById('ju-he'),
    getMemberById('hanbin-wang'),
    getMemberById('chenlun-kao'),
    getMemberById('zhipeng-li'),
    getMemberById('jiajun-chang'),
    getMemberById('md-fattah'),
    getMemberById('jacob-tagnan'),
    getMemberById('stephen-liwur'),
    getMemberById('shangrui-zhu'),
    getMemberById('kazi-jihadur-rashid'),
    getMemberById('segun-adewale-ojo')
  ]);

  const affiliatedMembers = collectMembers([
    getMemberById('qianwen-guo'),
    getMemberById('young-an-kim'),
    getMemberById('cynthia-fan-yang')
  ]);

  const staffMembers = collectMembers([getMemberById('crystal-goodwin')]);

  const sections: MemberDirectorySection[] = [
    {
      id: 'core',
      eyebrow: t('sections.core.eyebrow'),
      title: t('sections.core.title'),
      description: t('sections.core.description'),
      members: sortMembersByName(coreMembers)
    },
    {
      id: 'affiliated',
      eyebrow: t('sections.affiliated.eyebrow'),
      title: t('sections.affiliated.title'),
      description: t('sections.affiliated.description'),
      members: sortMembersByName(affiliatedMembers)
    },
    {
      id: 'graduate',
      eyebrow: t('sections.graduate.eyebrow'),
      title: t('sections.graduate.title'),
      description: t('sections.graduate.description'),
      members: sortMembersByName(graduateStudents)
    },
    {
      id: 'staff',
      eyebrow: t('sections.staff.eyebrow'),
      title: t('sections.staff.title'),
      description: t('sections.staff.description'),
      members: sortMembersByName(staffMembers)
    }
  ].filter((section) => section.members.length > 0);

  const overview = [
    {
      value: `${1 + coreMembers.length + affiliatedMembers.length + graduateStudents.length + staffMembers.length}`,
      label: t('overview.directory.label')
    },
    {
      value: `${coreMembers.length}`,
      label: t('overview.coreFaculty.label')
    },
    {
      value: `${affiliatedMembers.length}`,
      label: t('overview.affiliates.label')
    },
    {
      value: `${graduateStudents.length}`,
      label: t('overview.graduate.label')
    }
  ];

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-40">
        <header className="max-w-3xl">
          <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-accent-700 md:text-xs md:tracking-[0.42em]">
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-transparent to-accent-600/55"
            />
            {t('page.chip')}
          </p>
          <h1 className="mt-5 text-[2.1rem] font-semibold leading-[1.12] tracking-[-0.025em] text-ink-900 md:text-[3rem] md:leading-[1.06]">
            {t('page.title')}
          </h1>
          <p className="mt-6 text-base leading-8 text-ink-700 md:text-lg md:leading-9">
            {t('page.intro')}
          </p>
        </header>

        <MembersDirectory
          director={stewart}
          sections={sections}
          overview={overview}
        />
      </div>
    </section>
  );
}
