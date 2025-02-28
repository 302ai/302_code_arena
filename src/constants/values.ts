/**
 * @fileoverview Global constants and configuration values used throughout the application.
 * @author zpl
 * @created 2024-11-20
 */

export const THEME_COOKIE_NAME = "theme";
export const EMPTY_THEME = "light";
export const TRUE_STRING = "true";
export const FALSE_STRING = "false";
export const CHINA_REGION = "0";
export const OUTSIDE_DEPLOY_MODE = "OUTSIDE";
export const INTERNAL_DEPLOY_MODE = "INTERNAL";
export const SHARE_CODE_URL_PARAM = "pwd";
export const SHARE_CODE_STORE_KEY = "share_code";
export const SHARE_CODE_REMEMBER_KEY = "share_code_remember";

export const GLOBAL = {
  /**
   * Internationalization (i18n) configuration settings.
   * @property {Object} LOCALE - Locale-related constants
   * @property {string[]} LOCALE.SUPPORTED - List of supported language codes:
   *   - 'zh': Chinese
   *   - 'en': English
   *   - 'ja': Japanese
   * @property {string} LOCALE.DEFAULT - Default language code (English)
   */
  LOCALE: {
    SUPPORTED: ["zh", "en", "ja"],
    DEFAULT: "en",
  },
  GEN_TYPE: {
    SUPPORTED: [
      // { value: "web", name: "web" },
      { value: "html", name: "html" },
      { value: "react", name: "react" },
      { value: "python3", name: "python" },
      { value: "nodejs", name: "node.js" },
    ],
    DEFAULT: { value: "html", name: "html" },
  },
  QUICK_START: {
    SUPPORTED: [
      {
        text: "calculator",
        type: "web",
        prompt: {
          zh: "计算器",
          en: "Calculator",
          ja: "計算機",
        },
      },
      {
        text: "personal_finance_dashboard",
        type: "web",
        prompt: {
          zh: "个人理财仪表板",
          en: "Personal finance dashboard",
          ja: "パーソナルファイナンスダッシュボード",
        },
      },
      {
        text: "e-commerce_page",
        type: "web",
        prompt: {
          zh: "电商平台首页",
          en: "E-commerce platform homepage",
          ja: "eコマースプラットフォームのホームページ",
        },
      },
      {
        text: "exchange_rate_calculator",
        type: "web",
        prompt: {
          zh: "汇率转换器",
          en: "Exchange rate converter",
          ja: "為替レートコンバーター",
        },
      },
      {
        text: "quick_sort",
        type: "python3",
        prompt: {
          zh: "实现快速排序的算法",
          en: "Implement a quick sorting algorithm",
          ja: "高速ソートを実現するアルゴリズム",
        },
      },
      {
        text: "longest_common_substring",
        type: "python3",
        prompt: {
          zh: "写一个函数，实现寻找两个字符串最长的公共子串",
          en: "Write a function to find the longest common substring between two strings",
          ja: "2つの文字列の最も長い共通部分列を見つけるための関数を書く",
        },
      },
      {
        text: "binary_tree",
        type: "python3",
        prompt: {
          zh: "实现一个二叉树，包含插入、删除和查找等操作",
          en: "Implement a binary tree, including insertion, deletion, and search operations",
          ja: "二分木を実装し、挿入、削除、および検索操作を含める",
        },
      },
      {
        text: "shortest_path_algorithm",
        type: "python3",
        prompt: {
          zh: "实现一个最短路径的寻路算法",
          en: "Implement a shortest path finding algorithm",
          ja: "最短経路を見つけるアルゴリズムを実装する",
        },
      },
      {
        text: "quick_sort",
        type: "nodejs",
        prompt: {
          zh: "实现快速排序的算法",
          en: "Implement a quick sorting algorithm",
          ja: "高速ソートを実現するアルゴリズム",
        },
      },
      {
        text: "longest_common_substring",
        type: "nodejs",
        prompt: {
          zh: "写一个函数，实现寻找两个字符串最长的公共子串",
          en: "Write a function to find the longest common substring between two strings",
          ja: "2つの文字列の最も長い共通部分列を見つけるための関数を書く",
        },
      },
      {
        text: "binary_tree",
        type: "nodejs",
        prompt: {
          zh: "实现一个二叉树，包含插入、删除和查找等操作",
          en: "Implement a binary tree, including insertion, deletion, and search operations",
          ja: "二分木を実装し、挿入、削除、および検索操作を含める",
        },
      },
      {
        text: "shortest_path_algorithm",
        type: "nodejs",
        prompt: {
          zh: "实现一个最短路径的寻路算法",
          en: "Implement a shortest path finding algorithm",
          ja: "最短経路を見つけるアルゴリズムを実装する",
        },
      },
    ],
  },
};
