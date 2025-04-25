import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CreateDevice } from '../../../../../Classes/CreateDevice';
import { NgxDomConfettiService } from 'ngx-dom-confetti';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateDeviceStorage } from '../../../../../Classes/CreateDeviceStorage';
import { parseCDNUrl } from '../../../../../../util/utils';

@Component({
  selector: 'app-finish',
  standalone: false,
  templateUrl: './finish.component.html',
  styleUrl: './finish.component.css',
})
export class FinishComponent implements OnInit {
  public device: CreateDevice | undefined;

  constructor(
    private readonly router: Router,
    private route: ActivatedRoute,
  ) {}

  public deviceName: string = '';
  public deviceImage: string = '';

  ngOnInit(): void {
    let device = CreateDeviceStorage.getDeviceStorage();
    if (!device) {
      this.router.navigate(['/create-device']);
      return;
    }

    this.deviceName = device.deviceName;
    this.deviceImage = device.deviceImage as string;
  }

  public getImageUrl() {
    const url = parseCDNUrl(this.deviceImage);
    const imgUrl =
      'linear-gradient(rgba(123, 178, 142, 0.35), rgba(123, 178, 142, 0.35)), url(' +
      url +
      ')';
    return imgUrl;
  }

  public routeToSettings() {
    //Localstorage leegmaken
    localStorage.clear();
    this.router.navigate(['../..'], { relativeTo: this.route });
  }
}
