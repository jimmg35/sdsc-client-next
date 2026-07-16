import MembersDirectory, {
  type MemberDirectorySection
} from '@/components/Members/Directory';
import { MemberData, getMemberById } from '@/lib/members';
import { getTranslations, setRequestLocale } from 'next-intl/server';

const collectMembers = (entries: Array<MemberData | null>): MemberData[] =>
  entries.filter((entry): entry is MemberData => Boolean(entry));

const sortMembersByName = (members: MemberData[]): MemberData[] =>
  [...members].sort((left, right) =>
    left.name.localeCompare(right.name, 'en', { sensitivity: 'base' })
  );

export default async function Member(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
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
    getMemberById('shangrui-zhu')
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
      label: t('overview.directory.label'),
      detail: t('overview.directory.detail')
    },
    {
      value: `${coreMembers.length}`,
      label: t('overview.coreFaculty.label'),
      detail: t('overview.coreFaculty.detail')
    },
    {
      value: `${affiliatedMembers.length}`,
      label: t('overview.affiliates.label'),
      detail: t('overview.affiliates.detail')
    },
    {
      value: `${graduateStudents.length}`,
      label: t('overview.graduate.label'),
      detail: t('overview.graduate.detail')
    }
  ];

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-36 text-gold-100 md:pt-40">
        <header className="mb-16 text-center">
          <span className="chip-gold">{t('page.chip')}</span>
          <h1 className="mt-6 text-4xl font-semibold text-gold-50 text-glow md:text-5xl">
            {t('page.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gold-200/75 md:text-base">
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
