export class SignUpInfo {

    lastname: string;
    firstname: string;
    birthdate: string;
    city: string;
    gender: string;
    address: string;
    username: string;
    password: string;
    email: string;
    imageURL: any;
    role: string[];


  constructor(lastname: string, firstname: string, birthdate: string, city: string, gender: string, address: string, username: string, password: string, email: string, imageURL: any) {
    this.lastname = lastname;
    this.firstname = firstname;
    this.birthdate = birthdate;
    this.city = city;
    this.gender = gender;
    this.address = address;
    this.username = username;
    this.password = password;
    this.email = email;
    this.imageURL = imageURL;
    this.role = ['user'];
  }
}
