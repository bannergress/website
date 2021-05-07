import React, { FC, useEffect, useRef, useState } from 'react'
import { Button, Modal } from 'antd'
import { useInView } from 'react-intersection-observer'
import Scrollbars from 'react-custom-scrollbars'

import { useLoaded } from '../../hooks/Loaded'
import { ReactComponent as SVGMinimize } from '../../img/icons/minimize.svg'

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

const BannerPicture: FC<BannerPictureProps> = ({
  title,
  url,
  showFullImage = false,
}) => {
  const { ref, inView } = useInView({ threshold: 1 })
  const [modalOpened, setModalOpened] = useState(false)
  const [fullImage, setFullImage] = useState(false)
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

  const onCloseModal = () => {
    setModalOpened(false)
    setFullImage(false)
  }

  return (
    <>
      <Modal
        visible={modalOpened}
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
          <SVGMinimize /> Exit Full Screen
        </Button>
      </Modal>
      <div
        ref={ref}
        className="banner-card-picture"
        onClick={() => setModalOpened(showFullImage)}
        onKeyPress={(e) =>
          e.key === 'Enter' ? setModalOpened(showFullImage) : null
        }
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
  showFullImage?: boolean
}

export default BannerPicture
