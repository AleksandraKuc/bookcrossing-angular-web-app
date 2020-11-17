export class SignUpInfo {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  city: string;
  province: string;
  phoneNumber: number;
  roles: string[];
  password: string;

  constructor(name: string, lastName: string, username: string, email: string, city: string, province: string,
              phoneNumber: number, password?: string) {
    this.firstName = name;
    this.lastName = lastName;
    this.username = username;
    this.password = password;
    this.email = email;
    this.city = city;
    this.province = province;
    this.phoneNumber = phoneNumber;
    this.roles = ['ROLE_ADMIN'];
  }
}
