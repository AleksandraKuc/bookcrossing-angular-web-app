export class ResetPasswordInfo {
  username: string;
  currentPassword: string;
  newPassword: string;

  constructor(username: string, current: string, newPassword: string) {
    this.username = username;
    this.currentPassword = current;
    this.newPassword = newPassword;
  }
}
