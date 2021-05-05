import React, { FC, useEffect, useRef, useState } from 'react'
import { Button, Modal } from 'antd'
import { useInView } from 'react-intersection-observer'

import { useLoaded } from '../../hooks/Loaded'

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

const BannerPicture: FC<BannerPictureProps> = ({ title, url }) => {
  const { ref, inView } = useInView({ threshold: 1 })
  const [modalOpened, setModalOpened] = useState(false)
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

  return (
    <>
      <Modal
        visible={modalOpened}
        onCancel={() => setModalOpened(false)}
        onOk={() => setModalOpened(false)}
        footer={null}
        centered
        className="banner-card-modal"
      >
        <Button
          role="button"
          className="modal-image"
          onClick={() => setModalOpened(false)}
        >
          <img alt={title} src={url} />
        </Button>
      </Modal>
      <div
        ref={ref}
        className="banner-card-picture"
        onClick={() => setModalOpened(true)}
        onKeyPress={(e) => (e.key === 'U+000D' ? setModalOpened(true) : null)}
        role="button"
        tabIndex={0}
      >
        <div ref={innerRef} className="banner-card-picture-inner">
          <img ref={imgRef} alt={title} src={url} />
        </div>
      </div>
    </>
  )
}

export interface BannerPictureProps {
  url: string
  title?: string
}

export default BannerPicture
