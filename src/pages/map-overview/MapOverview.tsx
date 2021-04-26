import { LatLng, LatLngBounds } from 'leaflet'
import React, { Fragment } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { RouteComponentProps } from 'react-router-dom'
import './map.less'

export class MapOverview extends React.Component<MapOverviewProps> {
  constructor(props: MapOverviewProps) {
    super(props)
    this.state = {}
  }

  getParameters() {
    const { location } = this.props
    const parametersTemp = location.search.substring(1).split('&')
    const parameterMap = new Map()
    // set default values
    parameterMap.set('lat', 0)
    parameterMap.set('lng', 0)
    parameterMap.set('zoom', 3)
    for (let i = 0; i < parametersTemp.length; i += 1) {
      parameterMap.set(
        parametersTemp[i].split('=')[0],
        parametersTemp[i].split('=')[1]
      )
    }
    return parameterMap
  }

  render() {
    const parameterMap = this.getParameters()
    // if bounds parameter is set, use this, otherwise use lat,lng,zoom to center the map
    if (parameterMap.has('bounds')) {
      parameterMap.set('bounds', parameterMap.get('bounds').split(','))
      return (
        <Fragment>
          <MapContainer
            bounds={
              new LatLngBounds(
                new LatLng(
                  Number(parameterMap.get('bounds')[0]),
                  Number(parameterMap.get('bounds')[1])
                ),
                new LatLng(
                  Number(parameterMap.get('bounds')[2]),
                  Number(parameterMap.get('bounds')[3])
                )
              )
            }
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
            />
          </MapContainer>
        </Fragment>
      )
    }
    return (
      <Fragment>
        <MapContainer
          center={
            new LatLng(
              Number(parameterMap.get('lat')),
              Number(parameterMap.get('lng'))
            )
          }
          zoom={parameterMap.get('zoom')}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </Fragment>
    )
  }
}
export interface MapOverviewProps
  extends RouteComponentProps<{ lat: string; lng: string }> {}
