import ProfileCard from '@/components/Utility/ProfileCard';
import { MemberData, getMemberById } from '@/lib/members';

const collectMembers = (entries: Array<MemberData | null>): MemberData[] =>
  entries.filter((entry): entry is MemberData => Boolean(entry));

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
    getMemberById('md-fattah'),
    getMemberById('weining-kan'),
    getMemberById('hanbin-wang'),
    getMemberById('ju-he'),
    getMemberById('chenlun-kao'),
    getMemberById('zhipeng-li'),
    getMemberById('jiajun-chang'),
    getMemberById('jacob-tagnan'),
    getMemberById('stephen-liwur')
  ]);

  const affiliatedMembers = collectMembers([
    getMemberById('qianwen-guo'),
    getMemberById('young-an-kim')
  ]);

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
            and domain experts to advance spatial sciences and build forward-looking solutions for the communities we serve.
          </p>
        </header>

        {stewart && (
          <section className="surface-fade mb-16 px-6 py-10 md:px-12">
            <div className="mb-10 text-center text-gold-100">
              <p className="panel-title justify-center text-gold-300">
                Center Director
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-gold-50 text-glow">
                Center Director
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-gold-200/80">

              </p>
            </div>
            <div className="flex justify-center">
              <ProfileCard key={stewart.id} {...stewart} />
            </div>
          </section>
        )}

        <section className="surface-fade mb-16 px-6 py-10 md:px-12">
          <div className="mb-10 text-center text-gold-100">
            <p className="panel-title justify-center text-gold-300">
              Core Members
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-gold-50 text-glow">
              Core Faculty
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-gold-200/80">

            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {coreMembers.map((member) => (
              <ProfileCard key={member.id} {...member} />
            ))}
          </div>
        </section>

        <section className="surface-fade mb-10 px-6 py-10 md:px-12">
          <div className="mb-10 text-center text-gold-100">
            <p className="panel-title justify-center text-gold-300">
              Affiliated Members
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-gold-50 text-glow">
              Affiliated Members
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {affiliatedMembers.map((member) => (
              <ProfileCard key={member.id} {...member} />
            ))}
          </div>
        </section>

        <section className="surface-fade mb-10 px-6 py-10 md:px-12">
          <div className="mb-10 text-center text-gold-100">
            <p className="panel-title justify-center text-gold-300">
              Graduate Students
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-gold-50 text-glow">
              Graduate Students
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {graduateStudents.map((member) => (
              <ProfileCard key={member.id} {...member} />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
