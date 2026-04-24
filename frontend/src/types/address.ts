export type Address = {
  _id: string;
  fullName: string;
  address: string;
  city: string;
  pincode: string;
  mobileNumber: string;
  isPrimary: boolean;
};

export type AddressFormData = Omit<Address, "_id" | "isPrimary">;