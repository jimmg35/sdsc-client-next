import Banner from '@/components/Utility/Banner';
import ProfileCard from '@/components/Utility/ProfileCard';
import { MemberData, getMemberById } from '@/lib/members';
import { UserRound } from 'lucide-react';

export default function Member() {
  // Director
  const stewart: MemberData | null = getMemberById('stewart-fotheringham');

  // Core members
  const mason: MemberData | null = getMemberById('mason-mathews');
  const mehak: MemberData | null = getMemberById('mehak-sachdeva');
  const ziqi: MemberData | null = getMemberById('ziqi-li');

  // Graduate students
  const jim: MemberData | null = getMemberById('jiajun-chang');

  return (
    <section className="relative min-h-dvh">
      <Banner
        title="Member"
        imageUrl="/img/banners/member-banner.jpg"
        icon={<UserRound size={52} className="inline-block mr-2" />}
      />

      <div className="mx-auto max-w-7xl py-10 px-6">
        {/* Center Director */}
        {stewart && (
          <>
            <h2 className="text-2xl font-semibold text-center border-b border-gray-300 pb-2 mb-6">
              Center Director
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
              <ProfileCard key={stewart.id} {...stewart} />
            </div>
          </>
        )}

        {/* Core Members */}
        <h2 className="text-2xl font-semibold text-center border-b border-gray-300 pb-2 mb-6">
          Core Members
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
          {mason && <ProfileCard key={mason.id} {...mason} />}
          {mehak && <ProfileCard key={mehak.id} {...mehak} />}
          {ziqi && <ProfileCard key={ziqi.id} {...ziqi} />}
        </div>

        {/* Graduate Students */}
        <h2 className="text-2xl font-semibold text-center border-b border-gray-300 pb-2 mb-6">
          Graduate Students
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
          {jim && <ProfileCard key={jim.id} {...jim} />}
        </div>
      </div>
    </section>
  );
}
