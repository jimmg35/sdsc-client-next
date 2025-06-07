import fs from "fs";
import path from "path";

const membersDirectory = path.join(process.cwd(), "src", "contents", "members");

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
