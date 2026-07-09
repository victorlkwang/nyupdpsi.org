export interface RosterMember {
  src: string;
  number: string;
  name: string;
  major?: string;
  year?: string;
  instagram?: string;
  big: string;
  little: string;
}

export type RosterByClass = Record<string, RosterMember[]>;

export interface ExecBoardMember {
  role: string;
  name: string;
  image: string;
}

export interface RushTerm {
  term: string;
  cover: string;
  date: string;
}
