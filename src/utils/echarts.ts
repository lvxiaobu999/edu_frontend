// src/utils/echarts.ts
import * as echarts from 'echarts/core'
import {
  BarChart,
  LineChart,
  PieChart,
  // 引入更多的图表类型后缀为 ChartSeriesOption
  type BarSeriesOption,
  type LineSeriesOption,
  type PieSeriesOption,
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  // 引入组件类型后缀为 ComponentOption
  type TitleComponentOption,
  type TooltipComponentOption,
  type GridComponentOption,
  type DatasetComponentOption,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

// 通过 ComposeOption 组合出一个只有必须组件的 Option 类型
export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent,
])

export default echarts
