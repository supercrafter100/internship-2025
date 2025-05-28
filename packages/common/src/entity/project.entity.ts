export class Project {
  public id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public title!: string;
  public userId!: number;
  public public!: boolean;
  public imgKey!: string;
  public shortDescription!: string;
  public story!: string;

  public static fromJson(json: any): Project {
    const project = new Project();
    project.id = json.id;
    project.createdAt = new Date(json.createdAt);
    project.updatedAt = new Date(json.updatedAt);
    project.title = json.title;
    project.userId = json.userId;
    project.public = json.public;
    project.imgKey = json.imgKey;
    project.shortDescription = json.shortDescription;
    project.story = json.story;
    return project;
  }
}
