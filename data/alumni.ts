import type { RosterByClass } from "./types";

// Note: the old EJS site had "Alpha Tau" through "Alpha Chi" classes commented
// out of the alumni page (not deleted, just hidden). That was a content
// decision made before this migration, not a bug, so it's preserved here by
// omission rather than silently re-adding ~40 people to the public site.
// Ask the chapter if those classes should be brought back before adding them.
export const alumni: RosterByClass = {
  "Beta Alpha": [
    {
      src: "/images/alums/incompetent.png",
      number: "#217",
      name: "Nitin *Castling* Sagi",
      big: "Jeremy *PICK N ROLL* Zhou",
      little: "N/A",
    },
    {
      src: "/images/alums/incompetent.png",
      number: "#218",
      name: "Joon *Uppercut* Kim",
      big: "David *NEBULA* Lee",
      little: "Alex *Cullinan* Zhu, Derek *Valkyrie* Lan",
    },
    {
      src: "/images/alums/noah.jpg",
      number: "#219",
      name: "Noah *Longclaw* Kim",
      big: "Jeremy *PICK N ROLL* Zhou",
      little: "Troy *Longines* Bian, Yuchen *Longquan* Wang",
    },
  ],
  "Beta Beta": [
    {
      src: "/images/alums/vic.jpg",
      number: "#220",
      name: "Victor *CHROMEHEARTS* Teng",
      big: "Stephen *BURBERRY* Ye",
      little: "Daniel *GENTLE MONSTER* Sun",
    },
    {
      src: "/images/alums/jerry.jpg",
      number: "#221",
      name: "Jerry *OUROBOROS* Hao",
      big: "Daniel *LT. DAN* Huang",
      little: "Devon *VISIONARY* Shih, Ethan *VERTIGO* Chiu",
    },
    {
      src: "/images/alums/will.png",
      number: "#222",
      name: "Will *ALLSAINTS* Kang",
      big: "Stephen *BURBERRY* Ye",
      little: "Leo *SAINT LAURENT* Han, Bowen *MARGIELA* Liu",
    },
  ],
  "Beta Gamma": [
    {
      src: "/images/alums/roland.jpg",
      number: "#224",
      name: "Roland *PUFF THE MAGIC DRAGON* Yan",
      big: "Samson *CREAMPUFF* Chen",
      little: "Joshua *HUFFLEPUFF* Lee",
    },
    {
      src: "/images/alums/jeff.png",
      number: "#225",
      name: "Jeffrey *JIGGLYPUFF* Yeung",
      big: "Samson *CREAMPUFF* Chen",
      little: "Jim *CALCIFER* Hung, John *HARBINGER* Wang, Tony *MURAKAMI* Tian",
    },
    {
      src: "/images/alums/josh.jpg",
      number: "#226",
      name: "Joshua *KUZURI* Kim",
      big: "Chris *TANJIRO* Chan",
      little: "Aaron *Anabolic* Munford",
    },
  ],
  "Beta Delta": [
    {
      src: "/images/alums/devon.jpg",
      number: "#227",
      name: "Devon *VISIONARY* Shih",
      big: "Jerry *OUROBOROS* Hao",
      little: "Kevin *PARAGON* Huang, Dante *BANDIT* Ma, Nathan *KIRIN* Zhu",
    },
    {
      src: "/images/alums/ethan.png",
      number: "#228",
      name: "Ethan *VERTIGO* Chiu",
      big: "Jerry *OUROBOROS* Hao",
      little: "Leran *KANPEKI* Chang",
    },
    {
      src: "/images/alums/alex.png",
      number: "#229",
      name: "Alex *Cullinan* Zhu",
      big: "Joon *Uppercut* Kim",
      little: "N/A",
    },
    {
      src: "/images/alums/rich.jpg",
      number: "#230",
      name: "Richard *Dux Bellorum* Fan",
      big: "Derek *CARTE BLANCHE* Han",
      little: "Nico *Bellator* Salas, Andrew *Balerion* Xue",
    },
    {
      src: "/images/alums/derek.jpg",
      number: "#231",
      name: "Derek *Valkyrie* Lan",
      big: "Joon *Uppercut* Kim",
      little: "N/A",
    },
  ],
  "Beta Epsilon": [
    {
      src: "/images/bros/david.jpg",
      number: "#82",
      name: "David *GPA* Hao",
      big: "Raymond *JAYCE* Zhu (Theta Chapter)",
      little: "Victor *BEPO* Wang, Jason *SISYPHUS* Huang",
    },
  ],
  "Beta Zeta": [
    {
      src: "/images/alums/troy.png",
      number: "#232",
      name: "Troy *Longines* Bian",
      big: "Noah *Longclaw* Kim",
      little: "William *Daytona* Song, Minsung *Audemars* Kim, Harry *Seiko* Chen",
    },
    {
      src: "/images/alums/yuchen.png",
      number: "#234",
      name: "Yuchen *Longquan* Wang",
      big: "Noah *Longclaw* Kim",
      little: "N/A",
    },
    {
      src: "/images/alums/jimmy.jpg",
      number: "#235",
      name: "Jim *CALCIFER* Hung",
      big: "Jeffery *JIGGLYPUFF* Yeung",
      little: "Buck *PA*ZU* Vongnaraj",
    },
    {
      src: "/images/alums/john.jpg",
      number: "#236",
      name: "John *HARBINGER* Wang",
      big: "Jeffery *JIGGLYPUFF* Yeung",
      little: "Jiaming *EUNOIA* Pan",
    },
    {
      src: "/images/alums/leran.jpg",
      number: "#237",
      name: "Leran *KANPEKI* Chang",
      big: "Ethan *VERTIGO* Chiu",
      little: "Brandon *SHINRAI* Tang",
    },
    {
      src: "/images/alums/incompetent.png",
      number: "#238",
      name: "Tony *MURAKAMI* Tian",
      big: "Jeffrey *JIGGLYPUFF* Yeung",
      little: "N/A",
    },
    {
      src: "/images/alums/leo.jpg",
      number: "#239",
      name: "Leo *SAINT LAURENT* Han",
      big: "Will *ALLSAINTS* Kang",
      little: "Cody *ISSEY MIYAKE* Li",
    },
    {
      src: "/images/alums/bowen.png",
      number: "#241",
      name: "Bowen *MARGIELA* Liu",
      big: "Will *ALLSAINTS* Kang",
      little: "Kingfey *LORO PIANA* Wang",
    },
  ],
  "Beta Eta": [
    {
      src: "/images/bros/shoezz.jpg",
      number: "#243",
      name: "Andrew *Balerion* Xue",
      big: "Richard *Dux Bellorum* Fan",
      little: "N/A",
    },
    {
      src: "/images/bros/jason.jpg",
      number: "#245",
      name: "Jason *SISYPHUS* Huang",
      big: "David *GPA* Hao",
      little: "Calvin *GLACUS* Kim",
    },
    {
      src: "/images/bros/king.JPEG",
      number: "#246",
      name: "Kingfey *LORO PIANA* Wang",
      big: "Bowen *MARGIELA* Liu",
      little: "Caden *PRADA* Cewe",
    },
  ],
};
