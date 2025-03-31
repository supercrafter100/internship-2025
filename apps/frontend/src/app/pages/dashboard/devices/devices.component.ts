import { Component, OnInit } from '@angular/core';
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
import { DeviceService } from '../../../services/device.service';
import { ActivatedRoute } from '@angular/router';
import { parseCDNUrl } from '../../../../util/utils';
import { Device } from '../../../Interfaces/iDevice';

useGeographic();
// const layerNames = ['RoadOnDemand', 'Aerial', 'AerialWithLabelsOnDemand'];
const layerNames = ['RoadOnDemand', 'Aerial', 'AerialWithLabelsOnDemand'];

@Component({
  selector: 'app-dashboard-devices',
  standalone: false,
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css',
})
export class DashboardDevicesComponent implements OnInit {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly route: ActivatedRoute,
  ) {}

  public map!: Map;
  public _points: MapPoint[] = [];
  public url: string[] | undefined;
  public popupOverlay!: Overlay;

  public devices: Device[] = [];

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

    this.popupOverlay = new Overlay({
      element: document.getElementById('popup') as HTMLElement, // Getting popup element
      autoPan: true, // Auto-panning the map when the popup is opened
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
        zoom: 1,
        maxZoom: 20,
      }),
    });

    this.map.addOverlay(this.popupOverlay);

    this.map.on('click', (event) => {
      const feature = this.map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature,
      ); // Getting the clicked feature
      if (feature) {
        const coordinates = (feature.getGeometry() as Point).getCoordinates(); // Getting feature's coordinates

        const name = feature.get('name'); // Getting feature's name
        const image = feature.get('image'); // Getting feature's name
        const link = feature.get('link'); // Getting feature's name

        // Dynamically setting popup content
        document.getElementById('popup-title')!.textContent = name;
        document.getElementById('popup-description')!.textContent =
          `Coordinates: ${coordinates}`;
        (document.getElementById('popup-div') as any).style.backgroundImage =
          image;
        this.url = link;

        this.popupOverlay.setPosition(coordinates); // Setting popup position
      } else {
        this.popupOverlay.setPosition(undefined); // Hiding popup if clicked outside feature
      }
    });

    // Preload all the images for minimal loading time
    const imgCache = document.createElement('CACHE');
    imgCache.style = 'position:absolute;z-index:-1000;opacity:0';
    document.body.appendChild(imgCache);

    this.devices.forEach((device) => {
      const img = new Image();
      img.src = parseCDNUrl(device.imgKey)!;
      img.style = 'position:absolute';
      imgCache.appendChild(img);
    });
  }

  public async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (params) => {
      const projectId = params['id'];
      const devices = await this.deviceService.getDevicesForProject(projectId);
      this.devices = devices;
      this._points = devices.map((device) => ({
        coordinates: [
          parseFloat(device.longitude),
          parseFloat(device.latitude),
        ],
        name: device.name,
        image: this.getImage(device.imgKey),
        link: '/dashboard/' + projectId + '/devices/' + device.id,
      }));
      this.updateMapPoints();
    });
  }

  public getImage(url: string) {
    const u = parseCDNUrl(url);
    const imgUrl =
      'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(' + u + ')';

    console.log('Image URL:', imgUrl); // Log the image URL to the console
    return imgUrl;
  }

  public getImageUrl(url: string) {
    const u = parseCDNUrl(url);
    console.log('Image URL:', u); // Log the image URL to the console
    return u;
  }
}
