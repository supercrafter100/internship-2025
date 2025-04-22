export class TtnProvider {
  public id!: number;
  public projectId!: number;
  public appUrl!: string;
  public appId!: string;
  public apiKey!: string;
  public addedAt!: Date;
  public createdByid?: number;

  // Optional: relaties
  public TtnDeviceDetail?: TtnDeviceDetail[];

  public static fromJson(json: any): TtnProvider {
    const provider = new TtnProvider();
    provider.id = json.id;
    provider.projectId = json.projectId;
    provider.appUrl = json.appUrl;
    provider.appId = json.appId;
    provider.apiKey = json.apiKey;
    provider.addedAt = new Date(json.addedAt);
    provider.createdByid = json.createdByid ?? undefined;

    if (json.TtnDeviceDetail) {
      provider.TtnDeviceDetail = json.TtnDeviceDetail.map((d: any) =>
        TtnDeviceDetail.fromJson(d)
      );
    }

    return provider;
  }
}

export class TtnDeviceDetail {
  public id!: number;
  public deviceId!: string;
  public ttnProviderId!: number;

  // Optional: relaties
  public ttnProvider?: TtnProvider;

  public static fromJson(json: any): TtnDeviceDetail {
    const detail = new TtnDeviceDetail();
    detail.id = json.id;
    detail.deviceId = json.deviceId;
    detail.ttnProviderId = json.ttnProviderId;

    if (json.ttnProvider) {
      detail.ttnProvider = TtnProvider.fromJson(json.ttnProvider);
    }

    return detail;
  }
}
