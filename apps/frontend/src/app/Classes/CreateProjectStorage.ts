import { toBase64 } from '../../util/utils';

export class CreateProjectStorage {
  public projectName = '';
  public projectDescription = '';
  public projectImage: File | string | undefined;
  public projectStory = '';
  public launchpad: any = {};
  public public = false;

  public static fromLocalstorage(): CreateProjectStorage {
    const fromLocalStorage = localStorage.getItem('create-project-storage');
    if (fromLocalStorage) {
      const json = JSON.parse(fromLocalStorage);
      const storage = new CreateProjectStorage();
      storage.projectName = json.projectName;
      storage.projectDescription = json.projectDescription;

      if (json.projectImage) {
        // project image is base64 encoded, so we need to create a file from i
        storage.projectImage = json.projectImage;
      }

      storage.projectImage = json.projectImage;
      storage.projectStory = json.projectStory;
      storage.launchpad = json.launchpad;
      storage.public = json.public;
      return storage;
    }

    return new CreateProjectStorage();
  }

  public async saveToLocalStorage() {
    const projectImage =
      this.projectImage instanceof File
        ? await toBase64(this.projectImage)
        : this.projectImage;
    const json = {
      projectName: this.projectName,
      projectDescription: this.projectDescription,
      projectImage,
      projectStory: this.projectStory,
      launchpad: this.launchpad,
      public: this.public,
    };
    localStorage.setItem('create-project-storage', JSON.stringify(json));
  }

  public static clear() {
    localStorage.removeItem('create-project-storage');
  }
}
