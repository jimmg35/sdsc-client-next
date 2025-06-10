import Avatar from '@/components/Utility/Avatar';
import PublicationPost from '@/components/Utility/PublicationPost';
import { MemberPublication, getMemberById } from '@/lib/members';
import { ChevronLeft, GraduationCap, Mail } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = Promise<{
  slug: string;
}>;

export default async function ProfilePage(props: { params: Props }) {
  const { slug } = await props.params;
  const member = getMemberById(slug);

  if (!member) {
    notFound();
  }

  return (
    <section className="relative min-h-dvh">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex justify-between pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="max-w-3xl">
            <div className="mb-6">
              <Link
                className="text-sm font-medium text-teal-500 transition-colors hover:text-teal-600 flex items-center"
                href="/member"
              >
                <ChevronLeft size={16} className="inline-block mr-2" />
                Back To Members
              </Link>
            </div>
            <div className="flex items-center gap-6 mb-8">
              <Avatar src={member.thumbnail} size={180} />
              <div>
                <h1 className="text-3xl font-bold">{member.name}</h1>
                {member.title && (
                  <p className="text-lg text-gray-600">{member.title}</p>
                )}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <Link href={`mailto:${member.email}`}>
                    <div className="bg-teal-700 calcite-hover cursor-pointer select-none w-fit rounded-md flex items-center py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
                      <Mail size={16} className="mr-1" />
                      Email
                    </div>
                  </Link>
                  <Link href={member.googleScholar} target="_blank">
                    <div className="bg-teal-700 calcite-hover cursor-pointer select-none w-fit rounded-md flex items-center py-0.5 px-2.5 border border-transparent text-sm text-white transition-all shadow-sm">
                      <GraduationCap size={16} className="mr-1" />
                      Google Scholar
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <section className="p-6 w-full border-t border-black  ">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-teal-400 mb-1">
                    Department
                  </h3>
                  <p className="text-gray-700 ">{member.department}</p>
                </div>

                {/* Education */}
                {member.education && member.education.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-teal-400 mb-2">
                      Education
                    </h3>
                    <ul className="space-y-2">
                      {member.education.map((edu, idx) => (
                        <li key={idx} className="custom-li">
                          <p className="text-gray-800 font-medium">
                            {edu.degree} in {edu.field}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {edu.institution}, 2022
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Areas of Interest */}
                {member.aoi && member.aoi.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-teal-400 mb-2">
                      Areas of Interest
                    </h3>
                    <ul className="space-y-2">
                      {member.aoi.map((area, idx) => (
                        <li key={idx} className="custom-li">
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Honors */}
                {member.honor && member.honor.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-teal-400 mb-2">
                      Honors & Awards
                    </h3>
                    <ul className="space-y-2">
                      {member.honor.map((h, idx) => (
                        <li key={idx} className="custom-li">
                          <p className="text-gray-800 font-medium">{h.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {h.year}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Selected Publications */}
                {member.selectedPublications &&
                  member.selectedPublications.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-teal-400 mb-2">
                        Selected Publications
                      </h3>
                      <ul className="space-y-2">
                        {member.selectedPublications.map(
                          (pub: MemberPublication, idx: number) => (
                            <PublicationPost
                              {...pub} // Spread the publication properties
                              key={idx} // Use the publication ID as the key
                            />
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </section>

              {/* Courses Taught */}
              {member.courseTaught && member.courseTaught.length > 0 && (
                <div>
                  <h2 className="font-semibold text-gray-700">
                    Courses Taught
                  </h2>
                  <ul className="list-disc list-inside text-gray-600">
                    {member.courseTaught.map((course, idx) => (
                      <li key={idx}>{course}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
