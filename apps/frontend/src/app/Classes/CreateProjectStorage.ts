export class CreateProjectStorage {
  public projectName = '';
  public projectDescription = '';
  public projectImage: File | string | undefined;
  public projectStory = '';
  public launchpad: any = {};

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
      return storage;
    }

    return new CreateProjectStorage();
  }

  private toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  public async saveToLocalStorage() {
    const projectImage =
      this.projectImage instanceof File
        ? await this.toBase64(this.projectImage)
        : this.projectImage;
    const json = {
      projectName: this.projectName,
      projectDescription: this.projectDescription,
      projectImage,
      projectStory: this.projectStory,
      launchpad: this.launchpad,
    };
    localStorage.setItem('create-project-storage', JSON.stringify(json));
  }

  public clear() {
    localStorage.removeItem('create-project-storage');
  }
}
