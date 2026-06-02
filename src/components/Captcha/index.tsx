import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { drawCaptchaToCanvas } from './util'
import type { CaptchaInstance, CaptchaProps } from './type'

const defaultTextColors = [
  '#333',
  '#666',
  '#999',
  '#000',
  '#c0392b',
  '#e67e22',
  '#27ae60',
  '#2980b9',
]

const Captcha = forwardRef<CaptchaInstance, CaptchaProps>(function Captcha(
  {
    length = 4,
    mode = 'mixed',
    width = 120,
    height = 40,
    fontSize = 24,
    bgColor = '#f5f5f5',
    textColors = defaultTextColors,
    lineCount = 3,
    dotCount = 30,
    showBorder = true,
    borderColor = '#ddd',
    className,
    style,
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [currentCode, setCurrentCode] = useState('')

  const drawCaptcha = useCallback(() => {
    const nextCode = drawCaptchaToCanvas(canvasRef.current, {
      length,
      mode,
      width,
      height,
      fontSize,
      bgColor,
      textColors,
      lineCount,
      dotCount,
      showBorder,
      borderColor,
    })

    setCurrentCode(nextCode)
  }, [
    bgColor,
    borderColor,
    dotCount,
    fontSize,
    height,
    length,
    lineCount,
    mode,
    showBorder,
    textColors,
    width,
  ])

  const refresh = useCallback(() => {
    drawCaptcha()
  }, [drawCaptcha])

  const getCode = useCallback(() => currentCode, [currentCode])

  const validate = useCallback(
    (input: string) => input.toLowerCase() === currentCode.toLowerCase(),
    [currentCode],
  )

  useImperativeHandle(
    ref,
    () => ({
      getCode,
      refresh,
      validate,
    }),
    [getCode, refresh, validate],
  )

  useEffect(() => {
    drawCaptcha()
  }, [drawCaptcha])

  const canvasStyle = useMemo<CSSProperties>(
    () => ({
      cursor: 'pointer',
      display: 'inline-block',
      verticalAlign: 'middle',
      ...style,
    }),
    [style],
  )

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={canvasStyle}
      className={className}
      tabIndex={0}
      role="button"
      aria-label="点击刷新验证码"
      onClick={refresh}
    />
  )
})

export default Captcha
