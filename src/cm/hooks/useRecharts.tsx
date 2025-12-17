import {Text} from 'recharts'
import {getColorStyles} from '@cm/lib/methods/colors'
import {useMemo} from 'react'

export default function useRecharts() {
  const generateTicks = (start: number, end: number) => {
    const ticks: any[] = []
    for (let i = start; i <= end; i++) {
      ticks.push(i)
    }
    return ticks
  }

  const Bar = {
    CustomLabel: props => {
      const {x, y, width, height, fontSize, value} = props

      return (
        <Text
          {...{
            x: x + width / 2,
            y: y + height / 2,
            textAnchor: 'middle',
            dominantBaseline: 'middle',
            fontSize: fontSize,
            fontWeight: 'light',
            fill: 'white',
          }}
        >
          {value}
        </Text>
      )
    },
  }

  return useMemo(
    () => ({
      axis: {
        generateTicks,
        defaultProps: {
          fontSize: 14,
          interval: 0,
        },
      },

      style: {
        chartDefaultStyle: {
          border: '1px solid gray',
          width: 350,
          height: 350,

          margin: {
            top: 5,
            right: 20,
            bottom: 20,
            left: 5,
          },
        },

        getShapeProps: (props, bgColor) => {
          const {x, y, cx, cy, fill, index, payload, name, background, color, width, height} = props

          const {damageType, tooltipPosition, tooltipPayload, dataKey, ...rectProps} = props
          const r = 16
          return {
            rect: {...rectProps},
            circle: {cx, cy, r, fill},
            text: {
              x: x + r / 2,
              y: cy,
              fill: getColorStyles(bgColor).color,
              textAnchor: 'middle',
              style: {fontSize: 9, fontWeight: 'bold', textAlign: 'center', margin: 'auto'},
              alignmentBaseline: 'middle',
            },
          }
        },
      },

      Bar,
    }),
    []
  )
}

export type rechart_tickProps = {
  textAnchor: string
  verticalAnchor: string
  height: number
  orientation: string
  width: number
  x: number
  y: number
  className: string
  stroke: string
  fill: string
  index: string
  payload: {
    coordinate: number
    value: unknown
    index: number
    offset: number
    tickCoord: number
    isShow: boolean
  }
  visibleTicksCount: number
}
