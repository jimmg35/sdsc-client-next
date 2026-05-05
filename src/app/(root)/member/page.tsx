import MembersDirectory, {
  type MemberDirectorySection
} from '@/components/Members/Directory';
import { MemberData, getMemberById } from '@/lib/members';

const collectMembers = (entries: Array<MemberData | null>): MemberData[] =>
  entries.filter((entry): entry is MemberData => Boolean(entry));

const sortMembersByName = (members: MemberData[]): MemberData[] =>
  [...members].sort((left, right) =>
    left.name.localeCompare(right.name, 'en', { sensitivity: 'base' })
  );

export default function Member() {
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

  const sections: MemberDirectorySection[] = [
    {
      id: 'core',
      eyebrow: 'Core Members',
      title: 'Core Faculty',
      description:
        "Faculty members leading SDSC's central research agenda across spatial analytics, health, mobility, and computational social science.",
      members: sortMembersByName(coreMembers)
    },
    {
      id: 'affiliated',
      eyebrow: 'Affiliated Members',
      title: 'Affiliated Members',
      description:
        'Researchers connected to SDSC through collaborative projects, interdisciplinary scholarship, and adjacent domain expertise.',
      members: sortMembersByName(affiliatedMembers)
    },
    {
      id: 'graduate',
      eyebrow: 'Graduate Students',
      title: 'Graduate Students',
      description:
        'Graduate researchers building methods, applications, and empirical work that extend the center across emerging questions and new datasets.',
      members: sortMembersByName(graduateStudents)
    }
  ].filter((section) => section.members.length > 0);

  const overview = [
    {
      value: `${1 + coreMembers.length + affiliatedMembers.length + graduateStudents.length}`,
      label: 'Directory',
      detail:
        'Researchers listed across leadership, faculty, affiliates, and graduate scholarship.'
    },
    {
      value: `${coreMembers.length}`,
      label: 'Core Faculty',
      detail: "Faculty shaping the center's flagship research program."
    },
    {
      value: `${affiliatedMembers.length}`,
      label: 'Affiliates',
      detail: 'Interdisciplinary collaborators extending SDSC across domains.'
    },
    {
      value: `${graduateStudents.length}`,
      label: 'Graduate',
      detail: 'Emerging scholars advancing the next generation of SDSC work.'
    }
  ];

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-36 text-gold-100 md:pt-40">
        <header className="mb-16 text-center">
          <span className="chip-gold">People Of SDSC</span>
          <h1 className="mt-6 text-4xl font-semibold text-gold-50 text-glow md:text-5xl">
            Meet the minds advancing spatial data science
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gold-200/75 md:text-base">
            Our collective brings together geospatial analysts, data scientists,
            and domain experts to advance spatial sciences and build
            forward-looking solutions for the communities we serve.
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
