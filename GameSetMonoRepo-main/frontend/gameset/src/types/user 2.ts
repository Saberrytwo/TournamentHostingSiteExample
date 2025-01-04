export class User {
  userID: string | null;
  userName: string | null;
  imageURL: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  email: string | null;
  birthdate: string | null;
  zipcode: string | null;
  gender: string | null;
  
  constructor(data: Partial<User>) {
    this.userID = data.userID || null;
    this.userName = data.userName || null;
    this.imageURL = data.imageURL || null;
    this.firstName = data.firstName || null;
    this.lastName = data.lastName || null;
    this.phoneNumber = data.phoneNumber || null;
    this.email = data.email || null;
    this.birthdate = data.birthdate ? new Date(data.birthdate).toISOString() : null;
    this.zipcode = data.zipcode || null;
    this.gender = data.gender || null;
  }

  // Static method to create a null user
  static createNullUser(): User {
    return new User({
      userID: null,
      userName: null,
      imageURL: null,
      firstName: null,
      lastName: null,
      phoneNumber: null,
      email: null,
      birthdate: null,
      zipcode: null,
      gender: null,
    });
  }

  serialize(): Record<string, any> {
    return {
      userID: this.userID,
      userName: this.userName,
      imageURL: this.imageURL,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      email: this.email,
      birthdate: this.birthdate,
      zipcode: this.zipcode,
      gender: this.gender
    };
  }
}