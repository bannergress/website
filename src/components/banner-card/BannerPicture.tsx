import React, { FC, useEffect, useRef, useState } from 'react'
import { Button, Modal } from 'antd'
import { useInView } from 'react-intersection-observer'
import Scrollbars from 'react-custom-scrollbars-2'
import { Trans } from 'react-i18next'

import { useLoaded } from '../../hooks/Loaded'
import SVGMinimize from '../../img/icons/minimize.svg?react'

const getImageAnimation = (
  innerDiv: HTMLDivElement | null,
  img: HTMLImageElement | null
) => {
  if (innerDiv && img) {
    if (innerDiv.clientHeight < innerDiv.scrollHeight - 1) {
      const ratioPercent =
        (1 - innerDiv.scrollHeight / innerDiv.clientHeight) * 50
      const timeToBottom = 5_000
      const timePause = 1_000
      const timeToTop = 1_000
      const timeTotal = timeToBottom + timePause + timeToTop + timePause
      return img.animate(
        [
          {
            marginTop: '0%',
          },
          {
            marginTop: `${ratioPercent}%`,
            offset: timeToBottom / timeTotal,
          },
          {
            marginTop: `${ratioPercent}%`,
            offset: (timeToBottom + timePause) / timeTotal,
          },
          {
            marginTop: '0%',
            offset: (timeToBottom + timePause + timeToTop) / timeTotal,
          },
          {
            marginTop: '0%',
          },
        ],
        {
          easing: 'ease-in-out',
          duration: timeTotal,
          iterations: Infinity,
        }
      )
    }
  }
  return undefined
}

const BannerPicture: FC<BannerPictureProps> = ({
  title,
  url,
  size,
  showFullImage = false,
  lines = 3,
}) => {
  const { ref, inView } = useInView({ threshold: 1 })
  const [modalOpened, setModalOpened] = useState(false)
  const [fullImage, setFullImage] = useState(false)
  const innerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const loaded = useLoaded(imgRef)
  const animate =
    loaded &&
    inView &&
    !window.matchMedia('(prefers-reduced-motion)').matches &&
    lines > 2

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

  const onCloseModal = () => {
    setModalOpened(false)
    setFullImage(false)
  }

  return (
    <>
      <Modal
        open={modalOpened}
        onCancel={onCloseModal}
        onOk={onCloseModal}
        footer={null}
        centered
        className="banner-card-modal"
        width="95%"
      >
        <Button
          role="button"
          className={`modal-image ${fullImage && 'full-size'}`}
          onClick={() => setFullImage(!fullImage)}
        >
          <Scrollbars>
            <img alt={title} src={url} />
          </Scrollbars>
        </Button>
        <Button role="button" className="close-button" onClick={onCloseModal}>
          <Trans
            i18nKey="banners.exitFullscreen"
            components={{
              icon: <SVGMinimize />,
            }}
          />
        </Button>
      </Modal>
      <div
        key={`imageLoaded-${loaded}`}
        ref={ref}
        className={`banner-card-picture banner-lines-${lines}`}
        onClick={() => setModalOpened(showFullImage)}
        onKeyPress={(e) =>
          e.key === 'Enter' ? setModalOpened(showFullImage) : null
        }
        role="button"
        tabIndex={0}
      >
        <div
          ref={innerRef}
          className={`banner-card-picture-inner picture-size-${size}`}
        >
          <img ref={imgRef} alt={title} src={url} />
        </div>
      </div>
    </>
  )
}

export interface BannerPictureProps {
  url: string
  size: number
  title?: string
  showFullImage?: boolean
  lines?: number
}

export default BannerPicture
