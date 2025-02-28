export type SEOData = {
  supportLanguages: string[];
  fallbackLanguage: string;
  languages: Record<
    string,
    { title: string; description: string; image: string }
  >;
};

export const SEO_DATA: SEOData = {
  // TODO: Change to your own support languages
  supportLanguages: ["zh", "en", "ja"],
  fallbackLanguage: "en",
  // TODO: Change to your own SEO data
  languages: {
    zh: {
      title: "代码竞技场",
      description: "AI模型代码能力大比拼",
      image: "/images/global/desc_zh.png",
    },
    en: {
      title: "Code Arena",
      description: "AI Model Code Capability Competition",
      image: "/images/global/desc_en.png",
    },
    ja: {
      title: "コード競技場",
      description: "AIモデルコード能力の大勝負",
      image: "/images/global/desc_ja.png",
    },
  },
};
