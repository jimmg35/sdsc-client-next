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
  const amber: MemberData | null = getMemberById('amber-dejohn');
  const mark: MemberData | null = getMemberById('mark-horner');
  const christopher: MemberData | null = getMemberById('christopher-uejio');

  // Graduate students
  const jim: MemberData | null = getMemberById('jiajun-chang');
  const weining: MemberData | null = getMemberById('weining-kan');
  const fattah: MemberData | null = getMemberById('md-fattah');
  const jacob: MemberData | null = getMemberById('jacob-tagnan');
  const hanbin: MemberData | null = getMemberById('hanbin-wang');
  const allan: MemberData | null = getMemberById('chenlun-kao');
  console.log(allan);
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
          {amber && <ProfileCard key={amber.id} {...amber} />}
          {ziqi && <ProfileCard key={ziqi.id} {...ziqi} />}
          {mark && <ProfileCard key={mark.id} {...mark} />}
          {mason && <ProfileCard key={mason.id} {...mason} />}
          {mehak && <ProfileCard key={mehak.id} {...mehak} />}
          {christopher && <ProfileCard key={christopher.id} {...christopher} />}
        </div>

        {/* Graduate Students */}
        <h2 className="text-2xl font-semibold text-center border-b border-gray-300 pb-2 mb-6">
          Graduate Students
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
          {fattah && <ProfileCard key={fattah.id} {...fattah} />}
          {weining && <ProfileCard key={weining.id} {...weining} />}
          {allan && <ProfileCard key={allan.id} {...allan} />}
          {jim && <ProfileCard key={jim.id} {...jim} />}
          {jacob && <ProfileCard key={jacob.id} {...jacob} />}
          {hanbin && <ProfileCard key={hanbin.id} {...hanbin} />}
        </div>
      </div>
    </section>
  );
}
