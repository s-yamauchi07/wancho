import { createSystemFont, defaultConfig } from '@tamagui/config/v5'
import { createTamagui } from '@tamagui/core'

const notoSansJP = createSystemFont({
  font: {
    family: 'NotoSansJP',
    face: {
      400: { normal: 'NotoSansJP_400Regular' },
      700: { normal: 'NotoSansJP_700Bold' },
    },
  },
})

export const wanchoColors = {
  sage: '#ABB5A1',
  mint: '#A8C5BB',
  sandBeige: '#E7E2DB',
  taupe: '#C2B5A3',
  camel: '#C4A882',
  charcoal: '#333333',
  greige: '#6F6F6F',
  ivory: '#FAFAF7',
  paleBlue: '#A7BBC9',
  palePink: '#EBC8C6',
  lavender: '#D7D6E2',
  mauve: '#C4B5C4',
  lightGray: '#F2F2F2',
  white: '#FFFFFF',
  firebrick: '#b22222'
}

export const fontSizes = {
  display: 28,
  title: 24,
  heading1: 20,
  heading2: 18,
  body: 14,
  footnote: 12,
  caption: 11,
} as const

export const lineHeights = Object.fromEntries(
  Object.entries(fontSizes).map(([key, value]) => [key, value * 1.5])
) as { [K in keyof typeof fontSizes]: number }

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  fonts: {
    body: notoSansJP,
    heading: notoSansJP,
  },
  themes: {
    ...defaultConfig.themes,
    light: {
      ...(defaultConfig.themes as any).light,
      ...wanchoColors,
    },
    dark: {
      ...(defaultConfig.themes as any).dark,
      ...wanchoColors,
    },
  },
})

export default tamaguiConfig

export type Conf = typeof tamaguiConfig
