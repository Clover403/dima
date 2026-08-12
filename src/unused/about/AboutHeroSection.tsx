import type { RefObject } from 'react'
import SharedHeroSection from '../layout/SharedHeroSection'

type Props = {
  heroRef: RefObject<HTMLDivElement | null>
}

export default function AboutHeroSection({ heroRef }: Props) {
  return (
    <SharedHeroSection
      heroRef={heroRef}
      titleTop="Arquitectos del"
      titleBottom="equilibrio"
      description="Somos una Institución de Ingeniería Financiera fundada sobre la ideología y filosofìa del economista filantrópico Raymond Thomas Dalio."
    />
  )
}