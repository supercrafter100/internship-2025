import { Component } from '@angular/core';
import { useGeographic } from 'ol/proj';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import { MapPoint } from '../../../../types/types';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { BingMaps } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';

useGeographic();
const layerNames = [
  'microsoft.base.road',
  'microsoft.base.labels.road',
  'microsoft.base.hybrid.road',
  'microsoft.imagery',
];

@Component({
  selector: 'app-dashboard-devices',
  standalone: false,
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css',
})
export class DashboardDevicesComponent {
  public map!: Map;
  public _points: MapPoint[] = [];

  public updateMapPoints() {
    const features = this._points.map((point) => {
      const feature = new Feature({
        geometry: new Point(point.coordinates),
        name: point.name,
        image: point.image,
        link: point.link,
      });

      feature.setStyle(
        new Style({
          image: new Icon({
            src: 'assets/marker.png',
            scale: 0.1,
          }),
        }),
      );

      return feature;
    });

    const vectorSource = new VectorSource({
      features: features,
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    this.map = new Map({
      layers: [
        ...layerNames.map(
          (layer) =>
            new TileLayer({
              source: new BingMaps({
                key: 'AvW9qZ6QPCcCLQ1NhbQcxU50Gp-OSMMm34132MNGn4RxvOFur0vyTNXexQG53PK0',
                imagerySet: layer,
              }),
            }),
        ),
        vectorLayer,
      ],
      target: 'map',
      view: new View({
        center: this._points[0].coordinates,
        zoom: 18,
        maxZoom: 20,
      }),
    });
  }
}
