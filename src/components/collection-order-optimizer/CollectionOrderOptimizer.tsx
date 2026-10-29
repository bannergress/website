import { useEffect, useRef, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import type { Mission } from '../../features/mission/types'
import {
  COLLECTION_ORDER_LIMIT,
  FULL_ORDER_LIMIT,
  getMissionEndpoints,
  type CollectionOrderMode,
} from '../../features/banner/collectionOrder'
import { isPlaceholder } from '../../features/mission/helpers'
import { isMobile } from '../../features/utils/os'
import { calculateCollectionOrder } from '../../features/banner/collectionOrderClient'
import './CollectionOrderOptimizer.scss'

export const CollectionOrderOptimizer = ({
  missions,
  onOrdered,
  disabled,
  onRunningChange,
}: {
  missions: Mission[]
  onOrdered: (missions: Mission[], signal: AbortSignal) => void | Promise<void>
  disabled: boolean
  onRunningChange?: (running: boolean) => void
}) => {
  const { t } = useTranslation()
  const controller = useRef<AbortController | null>(null)
  const [running, setRunning] = useState<CollectionOrderMode | null>(null)
  const [error, setError] = useState<'error' | 'missingCoordinates'>()

  useEffect(() => {
    // Cancel when missions are added/removed/reordered or the page is left.
    return () => controller.current?.abort()
  }, [missions, disabled])

  const hasPlaceholders = missions.some(isPlaceholder)
  const supported =
    missions.length >= 2 && missions.length <= COLLECTION_ORDER_LIMIT
  const mobile = isMobile()
  const fullSupported = missions.length <= FULL_ORDER_LIMIT
  const fullWarning = t('banners.creation.order.fullWarning')

  const optimize = async (mode: CollectionOrderMode) => {
    if (mode === 'full' && (mobile || !fullSupported)) return
    controller.current?.abort()
    const current = new AbortController()
    controller.current = current
    setRunning(mode)
    onRunningChange?.(true)
    setError(undefined)
    try {
      if (missions.some((mission) => !getMissionEndpoints(mission))) {
        setError('missingCoordinates')
        return
      }
      const calculated = await calculateCollectionOrder(
        missions,
        current.signal,
        mode
      )
      if (!current.signal.aborted) {
        await onOrdered(
          calculated.order.map((index) => missions[index]),
          current.signal
        )
      }
    } catch {
      if (!current.signal.aborted) {
        setError('error')
        current.abort()
      }
    } finally {
      if (controller.current === current) {
        setRunning(null)
        onRunningChange?.(false)
      }
    }
  }

  return (
    <div className="collection-order-optimizer">
      <Button
        className="button-default"
        onClick={() => {
          void optimize('fast')
        }}
        loading={running === 'fast'}
        disabled={Boolean(running) || disabled || !supported || hasPlaceholders}
      >
        {t('banners.creation.order.fast')}
      </Button>
      {!mobile && (
        <Tooltip
          trigger={['hover', 'focus']}
          title={
            fullSupported
              ? fullWarning
              : t('banners.creation.order.fullLimit', { max: FULL_ORDER_LIMIT })
          }
        >
          <span className="collection-order-full" tabIndex={0}>
            <Button
              className="button-default"
              onClick={() => {
                void optimize('full')
              }}
              loading={running === 'full'}
              disabled={
                Boolean(running) ||
                disabled ||
                !supported ||
                !fullSupported ||
                hasPlaceholders
              }
            >
              {t('banners.creation.order.full')}
            </Button>
          </span>
        </Tooltip>
      )}
      {running && (
        <Button
          className="button-default"
          onClick={() => controller.current?.abort()}
        >
          {t('banners.creation.order.cancel')}
        </Button>
      )}
      {error && (
        <div className="collection-order-error" role="alert">
          {t(`banners.creation.order.${error}`)}
        </div>
      )}
    </div>
  )
}
