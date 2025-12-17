import React from 'react'
import {cn} from '../../shadcn/lib/utils'

type DynamicGridContainerProps = {
  children: React.ReactNode
  className?: string
  gap?: string
  maxCols?: {
    base?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
} & React.ComponentProps<'div'>

export const DynamicGridContainer: React.FC<DynamicGridContainerProps> = ({
  children,
  className,
  gap = 'gap-8',
  maxCols = {base: 1, sm: 1, lg: 2, xl: 3},
  ...props
}) => {
  const childrenArray = React.Children.toArray(children)
  const childCount = childrenArray.length

  // 子要素数に応じて列数を調整
  const getGridCols = (maxColsForBreakpoint: number) => {
    return Math.min(childCount, maxColsForBreakpoint)
  }

  // レスポンシブグリッドクラスを生成（Tailwindのpurgeに対応）
  const generateResponsiveGridClasses = () => {
    const classes = ['grid']

    // ベースサイズ
    if (maxCols.base) {
      const cols = getGridCols(maxCols.base)
      switch (cols) {
        case 1:
          classes.push('grid-cols-1')
          break
        case 2:
          classes.push('grid-cols-2')
          break
        case 3:
          classes.push('grid-cols-3')
          break
        case 4:
          classes.push('grid-cols-4')
          break
        case 5:
          classes.push('grid-cols-5')
          break
        case 6:
          classes.push('grid-cols-6')
          break
        case 7:
          classes.push('grid-cols-7')
          break
        case 8:
          classes.push('grid-cols-8')
          break
        case 9:
          classes.push('grid-cols-9')
          break
        case 10:
          classes.push('grid-cols-10')
          break
        case 11:
          classes.push('grid-cols-11')
          break
        case 12:
          classes.push('grid-cols-12')
          break
        default:
          classes.push('grid-cols-1')
      }
    }

    // smブレークポイント
    if (maxCols.sm) {
      const cols = getGridCols(maxCols.sm)
      switch (cols) {
        case 1:
          classes.push('sm:grid-cols-1')
          break
        case 2:
          classes.push('sm:grid-cols-2')
          break
        case 3:
          classes.push('sm:grid-cols-3')
          break
        case 4:
          classes.push('sm:grid-cols-4')
          break
        case 5:
          classes.push('sm:grid-cols-5')
          break
        case 6:
          classes.push('sm:grid-cols-6')
          break
        case 7:
          classes.push('sm:grid-cols-7')
          break
        case 8:
          classes.push('sm:grid-cols-8')
          break
        case 9:
          classes.push('sm:grid-cols-9')
          break
        case 10:
          classes.push('sm:grid-cols-10')
          break
        case 11:
          classes.push('sm:grid-cols-11')
          break
        case 12:
          classes.push('sm:grid-cols-12')
          break
        default:
          classes.push('sm:grid-cols-1')
      }
    }

    // mdブレークポイント
    if (maxCols.md) {
      const cols = getGridCols(maxCols.md)
      switch (cols) {
        case 1:
          classes.push('md:grid-cols-1')
          break
        case 2:
          classes.push('md:grid-cols-2')
          break
        case 3:
          classes.push('md:grid-cols-3')
          break
        case 4:
          classes.push('md:grid-cols-4')
          break
        case 5:
          classes.push('md:grid-cols-5')
          break
        case 6:
          classes.push('md:grid-cols-6')
          break
        case 7:
          classes.push('md:grid-cols-7')
          break
        case 8:
          classes.push('md:grid-cols-8')
          break
        case 9:
          classes.push('md:grid-cols-9')
          break
        case 10:
          classes.push('md:grid-cols-10')
          break
        case 11:
          classes.push('md:grid-cols-11')
          break
        case 12:
          classes.push('md:grid-cols-12')
          break
        default:
          classes.push('md:grid-cols-1')
      }
    }

    // lgブレークポイント
    if (maxCols.lg) {
      const cols = getGridCols(maxCols.lg)
      switch (cols) {
        case 1:
          classes.push('lg:grid-cols-1')
          break
        case 2:
          classes.push('lg:grid-cols-2')
          break
        case 3:
          classes.push('lg:grid-cols-3')
          break
        case 4:
          classes.push('lg:grid-cols-4')
          break
        case 5:
          classes.push('lg:grid-cols-5')
          break
        case 6:
          classes.push('lg:grid-cols-6')
          break
        case 7:
          classes.push('lg:grid-cols-7')
          break
        case 8:
          classes.push('lg:grid-cols-8')
          break
        case 9:
          classes.push('lg:grid-cols-9')
          break
        case 10:
          classes.push('lg:grid-cols-10')
          break
        case 11:
          classes.push('lg:grid-cols-11')
          break
        case 12:
          classes.push('lg:grid-cols-12')
          break
        default:
          classes.push('lg:grid-cols-1')
      }
    }

    // xlブレークポイント
    if (maxCols.xl) {
      const cols = getGridCols(maxCols.xl)
      switch (cols) {
        case 1:
          classes.push('xl:grid-cols-1')
          break
        case 2:
          classes.push('xl:grid-cols-2')
          break
        case 3:
          classes.push('xl:grid-cols-3')
          break
        case 4:
          classes.push('xl:grid-cols-4')
          break
        case 5:
          classes.push('xl:grid-cols-5')
          break
        case 6:
          classes.push('xl:grid-cols-6')
          break
        case 7:
          classes.push('xl:grid-cols-7')
          break
        case 8:
          classes.push('xl:grid-cols-8')
          break
        case 9:
          classes.push('xl:grid-cols-9')
          break
        case 10:
          classes.push('xl:grid-cols-10')
          break
        case 11:
          classes.push('xl:grid-cols-11')
          break
        case 12:
          classes.push('xl:grid-cols-12')
          break
        default:
          classes.push('xl:grid-cols-1')
      }
    }

    // 2xlブレークポイント
    if (maxCols['2xl']) {
      const cols = getGridCols(maxCols['2xl'])
      switch (cols) {
        case 1:
          classes.push('2xl:grid-cols-1')
          break
        case 2:
          classes.push('2xl:grid-cols-2')
          break
        case 3:
          classes.push('2xl:grid-cols-3')
          break
        case 4:
          classes.push('2xl:grid-cols-4')
          break
        case 5:
          classes.push('2xl:grid-cols-5')
          break
        case 6:
          classes.push('2xl:grid-cols-6')
          break
        case 7:
          classes.push('2xl:grid-cols-7')
          break
        case 8:
          classes.push('2xl:grid-cols-8')
          break
        case 9:
          classes.push('2xl:grid-cols-9')
          break
        case 10:
          classes.push('2xl:grid-cols-10')
          break
        case 11:
          classes.push('2xl:grid-cols-11')
          break
        case 12:
          classes.push('2xl:grid-cols-12')
          break
        default:
          classes.push('2xl:grid-cols-1')
      }
    }

    return classes.join(' ')
  }

  return (
    <div {...props} className={cn(generateResponsiveGridClasses(), gap, className)}>
      {children}
    </div>
  )
}

export default DynamicGridContainer
