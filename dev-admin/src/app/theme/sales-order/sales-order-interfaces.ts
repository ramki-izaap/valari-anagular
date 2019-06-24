export interface SalesOrderInterface {
    id: string,
    userInfo: UserInfoInterface,
    orderStatus: string,
    tax:string,
    orderAmount: string,
    shippingCost: string,
    orderDiscount: string,
    shippingDiscount: string,
    shippingAddress?: AddressInterface,
    billingAddress?: AddressInterface,
    orderType: string,
    paymentType: string,
    shipmentMethod: string,
    subTotal:string,
    refundAmount:string,
    items: Array<SalesOrderItemInterface>,
    orderDate: number
}

export interface SalesOrderItemInterface {
    id: string,
    name: string,
    sku: string,
    quantity: string,
    price: string,
    subtotal:number
}

export interface UserInfoInterface {
    id: string,
    email: string
}

export interface AddressInterface {
    id?: string,
	firstName?: string,
	lastName?: string,
	address1: string,
	address2: string,
	city: string,
	state: string,
	country: string,
	type?: string,
	zip: number,
	phoneNumber: number
};