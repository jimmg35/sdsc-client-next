import Banner from '@/components/Utility/Banner';
import ProfileCard from '@/components/Utility/ProfileCard';
import { MemberData, getAllMembers } from '@/lib/members';
import { UserRound } from 'lucide-react';

export default function Member() {
  const members: MemberData[] = getAllMembers();

  return (
    <section className="relative min-h-dvh">
      <Banner
        title="Member"
        imageUrl="/img/banners/member-banner.jpg"
        icon={<UserRound size={52} className="inline-block mr-2" />}
      />
      <div className="mx-auto max-w-7xl py-10 px-6 flex flex-wrap items-center justify-center gap-8">
        {members.map((member) => (
          <ProfileCard key={member.id} {...member} />
        ))}
      </div>
    </section>
  );
}
