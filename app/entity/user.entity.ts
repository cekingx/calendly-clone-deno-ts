export class UserEntity {
  id: number | undefined;
  name: string | undefined;
  username: string | undefined;

  constructor(data: Partial<UserEntity>) {
    this.id = data.id;
    this.name = data.name;
    this.username = data.username;
  }
}