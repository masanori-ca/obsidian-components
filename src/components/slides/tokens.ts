/**
 * Obsidian for PPT — Design Tokens
 *
 * All slide components reference these tokens.
 * Changing values here updates every component.
 *
 * Slide canvas: 1920 x 1080 px (16:9 Full HD)
 */

// ── Canvas ──

export const SLIDE = {
  width: 1920,
  height: 1080,
  padding: { top: 28, bottom: 24, left: 48, right: 48 },
  /** Usable content area */
  get contentWidth() { return this.width - this.padding.left - this.padding.right; },  // 1824
  get contentHeight() { return this.height - this.padding.top - this.padding.bottom; }, // 1028
  get contentX() { return this.padding.left; },
  get contentY() { return this.padding.top; },
} as const;

// ── Typography ──

export const FONT = {
  family: {
    primary: "'Noto Sans JP', 'Meiryo UI', sans-serif",
    data: "'JetBrains Mono', 'Consolas', monospace",
  },
  size: {
    /** スライドタイトル（1スライドに1つ） */
    slideTitle: 28,
    /** セクション見出し */
    sectionTitle: 18,
    /** コンポーネント内タイトル */
    componentTitle: 13,
    /** 本文 */
    body: 11,
    /** 説明文・キャプション */
    caption: 9,
    /** KPI大数字 */
    kpiLarge: 36,
    /** KPI中数字 */
    kpiMedium: 24,
    /** KPI小数字 */
    kpiSmall: 18,
    /** ラベル（カード上部等） */
    label: 8,
    /** バッジ・タグ */
    badge: 7,
    /** フッター */
    footer: 8,
    /** ポート番号・コード */
    code: 8,
    /** 極小注釈 */
    micro: 6,
  },
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.15,
    normal: 1.4,
    relaxed: 1.6,
  },
  letterSpacing: {
    label: 1,  // px
    normal: 0,
    tight: -0.3,
  },
} as const;

// ── Colors ──

export interface SlideColorScheme {
  name: string;
  /** 5色のアクセントパレット */
  accent: [string, string, string, string, string];
  /** テキスト */
  text: string;
  textMuted: string;
  textLight: string;
  /** 背景 */
  bg: string;
  cardBg: string;
  /** ステータス */
  success: string;
  warning: string;
  danger: string;
  /** 線・区切り */
  border: string;
  divider: string;
}

export const COLOR_SCHEMES: Record<string, SlideColorScheme> = {
  default: {
    name: "Default",
    accent: ["#3CCAFF", "#40F3AC", "#FF7793", "#FBDC2A", "#FFAF6D"],
    text: "#1A1A2E", textMuted: "#8E8E9A", textLight: "#BCBCC8",
    bg: "#FAFAFA", cardBg: "#FFFFFF",
    success: "#22C55E", warning: "#F59E0B", danger: "#EF4444",
    border: "#E8E8EC", divider: "#F0F0F4",
  },
  kurita: {
    name: "Kurita Water Industries",
    accent: ["#0059A5", "#00A0E9", "#38BDF8", "#7DD3FC", "#BAE6FD"],
    text: "#0F172A", textMuted: "#64748B", textLight: "#94A3B8",
    bg: "#FAFAFA", cardBg: "#FFFFFF",
    success: "#22C55E", warning: "#F59E0B", danger: "#EF4444",
    border: "#E2E8F0", divider: "#F1F5F9",
  },
  ebara: {
    name: "Ebara Corporation",
    accent: ["#003C71", "#0072CE", "#4FC3F7", "#81D4FA", "#B3E5FC"],
    text: "#0D1B2A", textMuted: "#546E7A", textLight: "#90A4AE",
    bg: "#FAFAFA", cardBg: "#FFFFFF",
    success: "#22C55E", warning: "#F59E0B", danger: "#EF4444",
    border: "#CFD8DC", divider: "#ECEFF1",
  },
  mono: {
    name: "Monochrome",
    accent: ["#333333", "#555555", "#777777", "#999999", "#BBBBBB"],
    text: "#1A1A1A", textMuted: "#888888", textLight: "#BBBBBB",
    bg: "#FFFFFF", cardBg: "#F5F5F5",
    success: "#333333", warning: "#666666", danger: "#1A1A1A",
    border: "#E0E0E0", divider: "#F0F0F0",
  },
  dark: {
    name: "Dark",
    accent: ["#3CCAFF", "#40F3AC", "#FF7793", "#FBDC2A", "#FFAF6D"],
    text: "#F8FAFC", textMuted: "#94A3B8", textLight: "#475569",
    bg: "#0F172A", cardBg: "#1E293B",
    success: "#34D399", warning: "#FBBF24", danger: "#F87171",
    border: "#334155", divider: "#1E293B",
  },
};

// ── Spacing ──

export const SPACING = {
  /** コンポーネント間の隙間 */
  gap: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  /** コンポーネント内の余白 */
  padding: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  /** カード角丸 */
  radius: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    pill: 999,
  },
} as const;

// ── Shadow ──

export const SHADOW = {
  none: "none",
  soft: "0 2px 8px rgba(0,0,0,0.06)",
  medium: "0 2px 12px rgba(0,0,0,0.08)",
  deep: "0 4px 20px rgba(0,0,0,0.12)",
  glow: (color: string) => `0 4px 14px ${color}40`,
} as const;

// ── Component Size Presets ──

/** 画面を分割した場合の標準サイズ */
export const LAYOUT = {
  /** 全幅 */
  full: { w: SLIDE.width - SLIDE.padding.left - SLIDE.padding.right, h: SLIDE.height - SLIDE.padding.top - SLIDE.padding.bottom },
  /** 半分（左右） */
  half: { w: Math.floor((SLIDE.width - SLIDE.padding.left - SLIDE.padding.right - SPACING.gap.lg) / 2) },
  /** 3分割 */
  third: { w: Math.floor((SLIDE.width - SLIDE.padding.left - SLIDE.padding.right - SPACING.gap.lg * 2) / 3) },
  /** 4分割 */
  quarter: { w: Math.floor((SLIDE.width - SLIDE.padding.left - SLIDE.padding.right - SPACING.gap.lg * 3) / 4) },

  /** タイトルエリア高さ */
  titleH: 80,
  /** フッター高さ */
  footerH: 28,
  /** KPIカード */
  kpiCard: { w: 280, h: 120 },
  /** フローノード */
  flowNode: { w: 130, h: 130 },
  /** 比較カード */
  comparisonCard: { w: 560, h: 220 },
  /** ユースケースカード */
  useCaseCard: { w: 420, h: 100 },
  /** タイムラインドット */
  timelineDot: 16,
} as const;

// ── Accent Bar ──

export const ACCENT_BAR = {
  /** 上部アクセントバーの高さ */
  height: 4,
  /** セクション区切りアクセントの幅 */
  sectionWidth: 60,
  /** セクション区切りアクセントの高さ */
  sectionHeight: 3,
} as const;

// ── Helper: CSSとして出力 ──

export function getSlideCSS(scheme: SlideColorScheme = COLOR_SCHEMES.default): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: ${SLIDE.width}px;
      height: ${SLIDE.height}px;
      overflow: hidden;
      font-family: ${FONT.family.primary};
      font-size: ${FONT.size.body}px;
      line-height: ${FONT.lineHeight.normal};
      color: ${scheme.text};
      background: ${scheme.bg};
      -webkit-font-smoothing: antialiased;
    }
    code, .mono { font-family: ${FONT.family.data}; }
  `;
}
