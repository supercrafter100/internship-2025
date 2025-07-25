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
import { XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import { DeviceService } from '../../../services/device.service';
import { ActivatedRoute } from '@angular/router';
import { parseCDNUrl } from '../../../../util/utils';
import { Device } from '../../../Interfaces/iDevice';

useGeographic();

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
  public loadingMap = true;

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

    const labelLayer = new TileLayer({
      source: new XYZ({
        url: 'https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}.png',
        maxZoom: 20,
      }),
      opacity: 0.7,
    });
    const streetsLayer = new TileLayer({
      source: new XYZ({
        url: 'https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}.png',
        maxZoom: 20,
      }),
      opacity: 0.5,
    });
    const mapboxSatellite = new TileLayer({
      source: new XYZ({
        url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3Rpam4tMTQwMDI0IiwiYSI6ImNtYmplcnJzbzBlbXYyaXF4NWtoeWlubmUifQ.ylpdsDiHlHNsWs0P-kpFvA',
        maxZoom: 22,
      }),
    });

    this.map = new Map({
      layers: [mapboxSatellite, labelLayer, streetsLayer, vectorLayer], // Add OSM and features
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2,
        maxZoom: 22,
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
        document.getElementById('popup')!.style.display = 'block';
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
      this.loadingMap = false;
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

  public getSortedDevices() {
    return this.devices.length
      ? this.devices.sort((a, b) => a.name.localeCompare(b.name))
      : [];
  }
}
