import type { CaptchaMode, DrawCaptchaOptions } from './type'

const getRandomChar = (mode: CaptchaMode): string => {
  const numberChars = '0123456789'
  const letterChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const mixedChars = numberChars + letterChars

  let chars = numberChars
  if (mode === 'letter') chars = letterChars
  if (mode === 'mixed') chars = mixedChars

  return chars[Math.floor(Math.random() * chars.length)]
}

const getRandomColor = (textColors: string[]): string => {
  return textColors[Math.floor(Math.random() * textColors.length)]
}

const generateCode = (length: number, mode: CaptchaMode): string => {
  return Array.from({ length }, () => getRandomChar(mode)).join('')
}

export const drawCaptchaToCanvas = (
  canvas: HTMLCanvasElement | null,
  options: DrawCaptchaOptions,
): string => {
  if (!canvas) return ''

  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const {
    width,
    height,
    bgColor,
    showBorder,
    borderColor,
    length,
    mode,
    fontSize,
    textColors,
    lineCount,
    dotCount,
  } = options

  ctx.clearRect(0, 0, width, height)

  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, width, height)

  if (showBorder) {
    ctx.strokeStyle = borderColor
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, width, height)
  }

  const code = generateCode(length, mode)
  const charWidth = width / length

  for (let i = 0; i < length; i++) {
    const char = code[i]
    const rotateAngle = ((Math.random() * 60 - 30) * Math.PI) / 180
    const x = i * charWidth + charWidth / 2 + (Math.random() * 10 - 5)
    const y = height / 2 + (Math.random() * 10 - 5)

    ctx.save()
    ctx.fillStyle = getRandomColor(textColors)
    ctx.font = `${fontSize}px Arial, sans-serif`
    ctx.textBaseline = 'middle'
    ctx.translate(x, y)
    ctx.rotate(rotateAngle)
    ctx.fillText(char, -fontSize / 2, 0)
    ctx.restore()
  }

  for (let i = 0; i < lineCount; i++) {
    ctx.strokeStyle = getRandomColor(textColors)
    ctx.lineWidth = Math.random() * 1.5 + 0.5
    ctx.beginPath()
    ctx.moveTo(Math.random() * width, Math.random() * height)
    ctx.lineTo(Math.random() * width, Math.random() * height)
    ctx.stroke()
  }

  for (let i = 0; i < dotCount; i++) {
    ctx.fillStyle = getRandomColor(textColors)
    const x = Math.random() * width
    const y = Math.random() * height
    const radius = Math.random() * 1.5 + 0.5

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  return code
}
