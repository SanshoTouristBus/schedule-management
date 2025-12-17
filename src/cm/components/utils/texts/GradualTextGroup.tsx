import useWindowSize from 'src/cm/hooks/useWindowSize'
import {arrToLines, MarkDownDisplay} from 'src/cm/components/utils/texts/MarkdownDisplay'
import {useEffect, useState} from 'react'
import {useInView} from 'react-intersection-observer'

const GradualTextGroup = ({textGroups}) => {
  const [activeSections, setactiveSections] = useState(Object.fromEntries(textGroups.map((_, i) => [i, false])))
  return (
    <>
      {textGroups.map((group, i) => {
        const prevSectionIsActive = i === 0 || activeSections[i - 1]
        const onActiveSectionCountBefore = Object.keys(activeSections).filter(key => Number(key) < i)?.length

        const isActive = activeSections[i]
        const activateSection = () => {
          setactiveSections(prev => ({...prev, [i]: true}))
        }
        return <Section key={i} {...{group, onActiveSectionCountBefore, activateSection, prevSectionIsActive}}></Section>
      })}
    </>
  )
}

const Section = ({group, onActiveSectionCountBefore, activateSection, prevSectionIsActive}) => {
  const {currentDevice} = useWindowSize()

  const animationPropString = {
    SP: `animate-[fade-in_1.5s_ease-out] animate-[scaleUp_4s] `,
    TB: `animate-[fade-in_2s_ease-out] animate-[scaleUp_4s] `,
    PC: `animate-[fade-in_2.5s_ease-out] animate-[scaleUp_4s] `,
  }
  const animationClass = animationPropString[currentDevice ?? '']

  const [activeProps, setactiveProps] = useState<any>(null)
  const {ref, inView} = useInView({
    triggerOnce: false,
    threshold: 0.5,
  })
  const {
    content,
    delay = prevSectionIsActive ? 0 : onActiveSectionCountBefore * 600,
    defaultProps = {className: 'opacity-0'},
    additionalProps = {className: animationClass},
  } = group

  useEffect(() => {
    setTimeout(() => {
      if (inView) {
        setactiveProps(prev => additionalProps)
        activateSection()
      }
    }, delay)
  }, [inView])

  const props = activeProps ? activeProps : defaultProps
  const md = arrToLines(content)

  return (
    <div ref={ref} {...props}>
      <MarkDownDisplay>{md}</MarkDownDisplay>
    </div>
  )
}

export default GradualTextGroup
