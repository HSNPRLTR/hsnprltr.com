import React from "react";
import { Server, Gamepad2, Globe, Sparkles } from "lucide-react";

export const getInhaledPastImages = () => [
  "/gallery/Inhaled Past/1.png?v=3",
  "/gallery/Inhaled Past/2.png?v=3",
  "/gallery/Inhaled Past/3.png?v=3"
];

export const getCarGameImages = () => [
  "/gallery/car game/car game photo/1.png",
  "/gallery/car game/car game photo/2.png",
  "/gallery/car game/car game photo/4.png",
  "/gallery/car game/car game photo/5.png",
  "/gallery/car game/car game photo/6.png",
  "/gallery/car game/car game photo/7.png"
];

export const getBackgroundPlanets = () => [
  { src: "/planets/planet.png", x: "10vw", y: "80vh", size: "8vw", opacity: 0.4 },
  { src: "/planets/planet2.png", x: "60vw", y: "10vh", size: "6vw", opacity: 0.1 },
  { src: "/planets/planet3.png", x: "88vw", y: "40vh", size: "5vw", opacity: 0.2 },
  { src: "/planets/planet4.png", x: "48vw", y: "75vh", size: "8vw", opacity: 0.3 },
  { src: "/planets/planet5.png", x: "60vw", y: "30vh", size: "7vw", opacity: 0.20 },
];

export const getMenuPlanets = (t: (key: any) => string) => [
  { name: t("planet_games"), href: "#games", model: "/3dplanets/blackhole.glb", x: "-5vw", y: "-15vh", size: "45vw", labelOffset: "-4.5vw", baseScale: 4, hoverRadius: 0.28 },
  { name: t("planet_projects"), href: "#software", model: "/3dplanets/dathomir.glb", x: "45vw", y: "5vh", size: "15vw", labelOffset: "-3.5vw", baseScale: 5.8 },
  { name: t("planet_contact"), href: "#contact", model: "/3dplanets/purple_planet.glb", x: "60vw", y: "60vh", size: "15vw", labelOffset: "-3.5vw", baseScale: 3.2 },
  { name: t("planet_work"), href: "#work-with-me", model: "/3dplanets/supernova-remnant-v4-fast-preview.glb", x: "70vw", y: "5vh", size: "20vw", labelOffset: "-4vw", baseScale: 4 },
  { name: t("planet_social"), href: "#social", model: "/3dplanets/tatooine.glb", x: "30vw", y: "50vh", size: "20vw", labelOffset: "-3.5vw", baseScale: 5 },
];

export const getGameProjects = (t: (key: any) => string) => [
  {
    id: "aksolotl",
    title: "Aksolotl Gazi",
    description: t("game_aksolotl_desc"),
    planetImg: "/gamePlanets/aksolotgaziplanet.png",
    engine: "Unity (C#)",
    role: t("game_aksolotl_role"),
    gained: t("game_aksolotl_gained"),
    gallery: [
      "/gallery/aksolotl/BjzHv1.png",
      "/gallery/aksolotl/DF+vFQ.png",
      "/gallery/aksolotl/h5IBF3.png",
      "/gallery/aksolotl/q46_Ph.png",
      "/gallery/aksolotl/W8XouH.png",
      "/gallery/aksolotl/_vzVL7.png"
    ],
    itchLink: "https://rejdak.itch.io/aksolotl-gazi"
  },
  {
    id: "justice",
    title: "Justice: Has Faces",
    description: t("game_justice_desc"),
    planetImg: "/gamePlanets/jhfplanet.png",
    engine: "Unity (C#)",
    role: t("game_justice_role"),
    gained: t("game_justice_gained"),
    gallery: [
      "/gallery/Justice/1tF17I.png",
      "/gallery/Justice/2a_Js9.png",
      "/gallery/Justice/HaBgNR.png",
      "/gallery/Justice/KgqVYs.png",
      "/gallery/Justice/q_riqB.png",
      "/gallery/Justice/rAK_Qc.png"
    ],
    isReversed: true,
    itchLink: "https://hsnprltr.itch.io/justice-has-faces"
  },
  {
    id: "fou",
    title: "Fragments of Us",
    description: t("game_fou_desc"),
    planetImg: "/gamePlanets/fouplanet.png",
    engine: "Unity (C#)",
    role: t("game_fou_role"),
    gained: t("game_fou_gained"),
    gallery: [
      "/gallery/fou/B1OqhU.png",
      "/gallery/fou/bsCjoo.png",
      "/gallery/fou/DpkAN4.png",
      "/gallery/fou/eF0WJs.png",
      "/gallery/fou/fLo24l.png",
      "/gallery/fou/iNZbPU.png",
      "/gallery/fou/J5xSV0.png",
      "/gallery/fou/nXD_3E.png",
      "/gallery/fou/Ydx8AN.png"
    ],
    itchLink: "https://hsnprltr.itch.io/fragmentsofus"
  },
  {
    id: "mermaiden",
    title: "MERMAIDEN",
    description: t("game_mermaiden_desc"),
    planetImg: "/gamePlanets/mermaidenplanet.png",
    engine: "Unity (C#)",
    role: t("game_mermaiden_role"),
    gained: t("game_mermaiden_gained"),
    gallery: [
      "/gallery/mermaiden/35x25+.png",
      "/gallery/mermaiden/5fldOr.png",
      "/gallery/mermaiden/e7cbnt.png",
      "/gallery/mermaiden/j9AtXB.png",
      "/gallery/mermaiden/KzVEHW.png",
      "/gallery/mermaiden/vcPymL.png",
      "/gallery/mermaiden/X1X9BM.png"
    ],
    isReversed: true,
    satellite: {
      img: "/Satellite/moon.png",
      title: t("game_mermaiden_sat_title"),
      docImages: [
        "/gallery/mermaiden/Mermaiden Doc/doc1.png",
        "/gallery/mermaiden/Mermaiden Doc/doc2.png",
        "/gallery/mermaiden/Mermaiden Doc/doc3.png",
        "/gallery/mermaiden/Mermaiden Doc/doc4.png"
      ],
      docLink: "https://drive.google.com/file/d/1_Pg77maf8Ekhm4ACzzhtGFcIkAEcRpC_/view?usp=drive_link"
    },
    itchLink: "https://hsnprltr.itch.io/mermaiden"
  },
  {
    id: "eotp",
    title: "Echoes of the Peak",
    description: t("game_eotp_desc"),
    planetImg: "/gamePlanets/eotpplanet.png",
    engine: "Unity (C#)",
    role: t("game_eotp_role"),
    gained: t("game_eotp_gained"),
    gallery: [
      "/gallery/eotp/1.png",
      "/gallery/eotp/2.png",
      "/gallery/eotp/3.png",
      "/gallery/eotp/4.png",
      "/gallery/eotp/5.png",
      "/gallery/eotp/6.png",
      "/gallery/eotp/7.png",
      "/gallery/eotp/8.png",
      "/gallery/eotp/9.png"
    ],
    itchLink: "https://hsnprltr.itch.io/echoes-of-the-peak"
  },
  {
    id: "brokenheart",
    title: "Broken Heart",
    description: t("game_brokenheart_desc"),
    planetImg: "/gamePlanets/brokenheartplanet.png",
    engine: "Unity (C#)",
    role: t("game_brokenheart_role"),
    gained: t("game_brokenheart_gained"),
    gallery: [
      "/gallery/brokenheart/iA079J.png",
      "/gallery/brokenheart/iiDlm5.png",
      "/gallery/brokenheart/P7XDuc.png",
      "/gallery/brokenheart/tkxHb_.png",
      "/gallery/brokenheart/VLffUn.png"
    ],
    isReversed: true,
    itchLink: "https://hsnprltr.itch.io/broken-heart"
  },
  {
    id: "rrtd",
    title: "Rock & Roll the Dice",
    description: t("game_rrtd_desc"),
    planetImg: "/gamePlanets/r&rtdplanet.png",
    engine: "Unity (C#)",
    role: t("game_rrtd_role"),
    gained: t("game_rrtd_gained"),
    gallery: [
      "/gallery/rrtd/4llqPy.png",
      "/gallery/rrtd/a6PjDW.png",
      "/gallery/rrtd/BY+Elq.png",
      "/gallery/rrtd/P2mjx+.png"
    ],
    itchLink: "https://hsnprltr.itch.io/rock-roll-the-dice"
  },
  {
    id: "clozopine",
    title: "CLOZOPINE",
    description: t("game_clozopine_desc"),
    planetImg: "/gamePlanets/clozopineplanet.png",
    engine: "Unity (C#)",
    role: t("game_clozopine_role"),
    gained: t("game_clozopine_gained"),
    gallery: [
      "/gallery/clozopine/2fuSir.png",
      "/gallery/clozopine/dBQdLb.png",
      "/gallery/clozopine/njrunJ.png",
      "/gallery/clozopine/tKy35N.png",
      "/gallery/clozopine/u1kDYt.png"
    ],
    isReversed: true,
    itchLink: "https://hsnprltr.itch.io/clozopine"
  }
];

export const getSoftwareProjects = (t: (key: any) => string, language: string) => [
  {
    title: language === "tr" ? "Akademik REST API Sistemi" : "Academic REST API System",
    description: t("soft_rest_desc"),
    detailedDescription: t("soft_rest_detailed"),
    techStack: ["C#", ".NET", "ASP.NET Core", "EF Core", "SQLite", "PostgreSQL", "Swagger"],
    githubUrl: "https://github.com/HSNPRLTR/Akademik-Yonetim-Sistemi",
    icon: <Server />,
    role: t("soft_rest_role"),
    gallery: [
      "/gallery/Rest api/1.png",
      "/gallery/Rest api/2.png",
      "/gallery/Rest api/3.png",
      "/gallery/Rest api/4.png",
      "/gallery/Rest api/8.png",
      "/gallery/Rest api/10.png"
    ]
  },
  {
    title: language === "tr" ? "2D Oyun Motoru" : "2D Game Engine",
    description: t("soft_engine_desc"),
    detailedDescription: t("soft_engine_detailed"),
    techStack: ["C++", "Lua", "XML", "JSON", "Component Architecture"],
    githubUrl: "https://github.com/HSNPRLTR/Game-Engine-Project",
    icon: <Gamepad2 />,
    role: t("soft_engine_role"),
    gallery: [
      "/gallery/GameEngine/1.png",
      "/gallery/GameEngine/2.png",
      "/gallery/GameEngine/3.png",
      "/gallery/GameEngine/4.png",
      "/gallery/GameEngine/5.png"
    ]
  },
  {
    title: language === "tr" ? "E-Ticaret Sitesi" : "E-Commerce Website",
    description: t("soft_ecommerce_desc"),
    detailedDescription: t("soft_ecommerce_detailed"),
    techStack: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    githubUrl: "https://github.com/HSNPRLTR/KasaCeption",
    icon: <Globe />,
    role: t("soft_ecommerce_role"),
    gallery: [
      "/gallery/pcselling/1.png",
      "/gallery/pcselling/2.png",
      "/gallery/pcselling/3.png",
      "/gallery/pcselling/4.png",
      "/gallery/pcselling/5.png",
      "/gallery/pcselling/6.png"
    ]
  },
  {
    title: language === "tr" ? "Kişisel Portfolyo Sitesi" : "Personal Portfolio Website",
    description: t("soft_portfolio_desc"),
    detailedDescription: t("soft_portfolio_detailed"),
    techStack: ["Next.js", "React", "TypeScript", "Three.js", "Framer Motion", "Tailwind CSS"],
    githubUrl: "https://github.com/HSNPRLTR/HSNPRLTR.COM",
    icon: <Sparkles />,
    role: t("soft_portfolio_role"),
    gallery: []
  }
];

export const getCertificates = (t: (key: any) => string, language: string) => [
  {
    title: "Introduction to Software Engineering",
    issuer: "IBM",
    date: "2025",
    credentialUrl: "https://drive.google.com/file/d/1o7Dz3RLkJpyeOBXKztrzAnCGOOQtVOiv/view?usp=drive_link",
    skills: ["Software Engineering", "SDLC", "Agile", "DevOps"],
    description: t("cert_se_desc"),
    detailedDescription: t("cert_se_detailed")
  },
  {
    title: "Game Theory",
    issuer: "Stanford & Yale University",
    date: "2025",
    credentialUrl: "https://drive.google.com/file/d/1_gmvlHfMvm0stMWC_gTP-oYSkNW9LGD4/view?usp=drive_link",
    skills: ["Game Theory", "Strategic Thinking", "Nash Equilibrium", "Economics"],
    description: t("cert_gt_desc"),
    detailedDescription: t("cert_gt_detailed")
  },
  {
    title: "Introduction to Game Design",
    issuer: "Epic Games",
    date: "2025",
    credentialUrl: "https://drive.google.com/file/d/1DNZD9gWb_mY8SHjba5KzkC0FMx5rFXdO/view?usp=drive_link",
    skills: ["Game Design", "Epic Games", "Level Design", "Gameplay Mechanics"],
    description: t("cert_gd_desc"),
    detailedDescription: t("cert_gd_detailed")
  },
  {
    title: language === "tr" ? "Oyun Pazarlama Temelleri" : "Game Marketing Fundamentals",
    issuer: "BTK Akademi",
    date: "2025",
    credentialUrl: "https://drive.google.com/file/d/1Sl8ny9_QziomKNiUz9hnHuzjP3BLthSu/view?usp=drive_link",
    skills: ["Game Marketing", "ASO", "User Acquisition", "PR"],
    description: t("cert_gm_desc"),
    detailedDescription: t("cert_gm_detailed")
  }
];

export const getEducations = (t: (key: any) => string, language: string) => [
  {
    title: language === "tr" ? "Atatürk Anadolu Lisesi" : "Ataturk Anatolian High School",
    issuer: language === "tr" ? "Lise Mezuniyeti" : "High School Graduation",
    date: "2019 - 2023",
    skills: language === "tr"
      ? ["Temel Bilimler", "Sayısal Ağırlıklı", "Edebiyat", "Felsefe", "Yabancı Dil"]
      : ["Basic Sciences", "Quantitative Stream", "Literature", "Philosophy", "Foreign Language"],
    description: t("edu_lise_desc"),
    detailedDescription: t("edu_lise_detailed")
  },
  {
    title: language === "tr" ? "KTO Karatay Üniversitesi" : "KTO Karatay University",
    issuer: language === "tr" ? "Bilgisayar Programcılığı Bölümü" : "Computer Programming Department",
    date: "2024 - 2026",
    skills: ["C", "HTML", "CSS", "C++", "SQL", "C#", "MS SQL", "MySQL", "OOP", "DataGridView", "MS Office"],
    description: t("edu_uni_desc"),
    detailedDescription: t("edu_uni_detailed")
  },
  {
    title: t("edu_lang_title"),
    issuer: t("edu_lang_issuer"),
    date: t("edu_lang_date"),
    skills: language === "tr"
      ? ["Okuma", "Yazma", "Dinleme"]
      : ["Reading", "Writing", "Listening"],
    description: t("edu_lang_desc"),
    detailedDescription: t("edu_lang_detailed")
  }
];
