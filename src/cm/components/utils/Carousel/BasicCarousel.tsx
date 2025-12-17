'use client'
import {Carousel} from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import ContentPlayer from 'src/cm/components/utils/ContentPlayer'

import {Button} from 'src/cm/components/styles/common-components/Button'
import {CSSProperties} from 'react'
import {ChevronsLeftIcon, ChevronsRightIcon} from 'lucide-react'
import {cl} from 'src/cm/lib/methods/common'

export type CarouselImageType = {
  title?: string
  description?: string
  imageUrl: string
}
const BasicCarousel = (props: {
  Images: CarouselImageType[]
  imgStyle?: CSSProperties
  options?: {
    renderIndicator?: boolean
  }
}) => {
  const {Images, imgStyle = {width: 320, height: 280}, options} = props

  return (
    <div style={{...imgStyle}} className={`mx-auto `}>
      <Carousel
        {...{
          renderArrowPrev: (onClickHandler, hasPrev, label) => RenderArrow({onClickHandler, active: hasPrev, label, pos: 'left'}),
          renderArrowNext: (onClickHandler, hasNext, label) =>
            RenderArrow({onClickHandler, active: hasNext, label, pos: 'right'}),
          renderIndicator: options?.renderIndicator ? renderIndicator : undefined,
          autoPlay: true,
        }}
      >
        {Images?.map((data: CarouselImageType, index: number) => {
          const {title, imageUrl} = data
          return <ContentPlayer src={imageUrl} key={index} styles={{thumbnail: imgStyle}} />
        })}
      </Carousel>
    </div>
  )
}

export default BasicCarousel

const RenderArrow = ({onClickHandler, active, label, pos}) => {
  if (!active) return
  const arrowClass = ` w-7 z-10    onHover`
  const ArrowIcon = pos === 'right' ? <ChevronsRightIcon className={arrowClass} /> : <ChevronsLeftIcon className={arrowClass} />

  const className = cl(
    pos === 'right' ? 'right-4' : 'left-4 ',
    active ? '' : 'disabled',
    ` text-primary-main  `,
    `absolute bottom-2     `,
    arrowClass
  )

  return <div {...{className, onClick: onClickHandler, title: label}}>{ArrowIcon}</div>
}

const renderIndicator = (onClickHandler, isSelected, index, label) => {
  const indicatorClasname = `mx-2 inline-block h-7 w-7  rounded-full text-white`
  return (
    <Button
      active={isSelected}
      color={isSelected ? 'blue' : 'sub'}
      onClick={onClickHandler}
      className={indicatorClasname}
      aria-label={`Selected: ${label} ${index + 1}`}
      // title={`Selected: ${label} ${index + 1}`}
    >
      {index + 1}
    </Button>
  )
}
