export interface ShippingCreation {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    zipcode: number;
}

export interface CustomerCreation {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userID: string;
}
