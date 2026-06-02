import type { CSSProperties } from 'react'

export type CaptchaMode = 'number' | 'letter' | 'mixed'

export interface CaptchaProps {
  length?: number
  mode?: CaptchaMode
  width?: number
  height?: number
  fontSize?: number
  bgColor?: string
  textColors?: string[]
  lineCount?: number
  dotCount?: number
  showBorder?: boolean
  borderColor?: string
  className?: string
  style?: CSSProperties
}

export interface CaptchaInstance {
  refresh: () => void
  getCode: () => string
  validate: (input: string) => boolean
}

export interface DrawCaptchaOptions {
  length: number
  mode: CaptchaMode
  width: number
  height: number
  fontSize: number
  bgColor: string
  textColors: string[]
  lineCount: number
  dotCount: number
  showBorder: boolean
  borderColor: string
}
