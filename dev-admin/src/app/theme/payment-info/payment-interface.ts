export interface PaymentInterface {
    email: string;
    // mode:string;
    username: string;
    password: string;
    signature: string;
    clientid?: string;
    type: string;
}
export interface AuthorizeInterface {
    api_transaction_key: string;
    api_login_id: string;
    // mode:string;
    type: string;
}
