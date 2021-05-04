import React, { FC, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

import { Banner } from '../../features/banner'
import { useLoaded } from '../../hooks/Loaded'
import { ReactComponent as SVGExplorer } from '../../img/icons/explorer.svg'
import { ReactComponent as SVGPointer } from '../../img/icons/pointer.svg'

import './banner-card.less'

const baseUrl = process.env.REACT_APP_API_BASE_URL

const getDistance = (distance: number) => `${(distance / 1000).toFixed(1)} km`

const getImageAnimation = (
  innerDiv: HTMLDivElement | null,
  img: HTMLImageElement | null
) => {
  if (innerDiv && img) {
    if (innerDiv.clientHeight < innerDiv.scrollHeight - 1) {
      const ratioPercent =
        (1 - innerDiv.scrollHeight / innerDiv.clientHeight) * 50
      return img.animate(
        [
          {
            marginTop: '0%',
          },
          {
            marginTop: '0%',
            offset: 0.05,
          },
          {
            marginTop: `${ratioPercent}%`,
            offset: 0.95,
          },
          {
            marginTop: `${ratioPercent}%`,
          },
        ],
        {
          direction: 'alternate',
          easing: 'ease-in-out',
          duration: 10_000,
          iterations: Infinity,
        }
      )
    }
  }
  return undefined
}

const BannerCard: FC<BannerCardProps> = ({ banner, selected }) => {
  const { ref, inView } = useInView({ threshold: 1 })
  const innerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const loaded = useLoaded(imgRef)
  const animate =
    loaded && inView && !window.matchMedia('(prefers-reduced-motion)').matches
  useEffect(() => {
    const innerDiv = innerRef.current
    const img = imgRef.current
    const animation = animate ? getImageAnimation(innerDiv, img) : undefined
    return () => {
      if (animation) {
        animation.cancel()
      }
    }
  }, [innerRef, imgRef, animate])

  const url = banner && banner.picture && new URL(banner.picture, baseUrl).href
  const className = selected ? 'banner-card selected' : 'banner-card'
  return (
    <div className={className}>
      <div className="banner-card-title">{banner?.title}</div>
      {banner && url && (
        <div ref={ref} className="banner-card-picture">
          <div ref={innerRef} className="banner-card-picture-inner">
            <img ref={imgRef} alt={banner.title} src={url} />
          </div>
        </div>
      )}
      <div className="banner-info-item">
        <SVGExplorer fill="#1DA57A" className="icon" />
        {banner?.numberOfMissions} Missions,{' '}
        {banner && banner.lengthMeters
          ? getDistance(banner?.lengthMeters)
          : null}
      </div>
      <div className="banner-info-item">
        <SVGPointer fill="#1DA57A" className="icon" />
        {banner?.formattedAddress}
      </div>
    </div>
  )
}

export interface BannerCardProps {
  banner: Banner | undefined
  selected: boolean
}

export default BannerCard
