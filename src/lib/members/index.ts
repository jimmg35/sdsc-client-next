import fs from 'fs';
import path from 'path';

const membersDirectory = path.join(process.cwd(), 'src', 'contents', 'members');

export interface MemberEducation {
  degree: string;
  field: string;
  institution: string;
  year: number;
}

export interface MemberHonor {
  title: string;
  year: number;
}

export interface MemberPublication {
  id: string;
  author: string;
  title: string;
  journal: string;
  catalog: string;
  doi: string;
}

export interface MemberData {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  thumbnail: string;
  googleScholar: string;
  education: MemberEducation[];
  honor: MemberHonor[];
  selectedPublications: MemberPublication[];
  courseTaught: string[];
  aoi: string[];
}

export function getAllMembers(): MemberData[] {
  const memberNames = fs.readdirSync(membersDirectory);

  const members = memberNames.map((memberName) => {
    const filePath = path.join(membersDirectory, memberName, 'meta.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const {
      id,
      name,
      title,
      department,
      email,
      thumbnail,
      googleScholar,
      education,
      honor,
      selectedPublications,
      courseTaught,
      aoi
    } = JSON.parse(fileContents);

    return {
      id,
      name,
      title,
      department,
      email,
      thumbnail,
      googleScholar,
      education: education || [],
      honor: honor || [],
      selectedPublications: selectedPublications || [],
      courseTaught: courseTaught || [],
      aoi: aoi || []
    };
  });

  return members;
}

export function getMemberById(id: string): MemberData | null {
  const members = getAllMembers();
  const member = members.find((mem) => mem.id === id);
  return member || null;
}
