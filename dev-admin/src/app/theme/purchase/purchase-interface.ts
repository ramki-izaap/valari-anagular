export interface ProductInterface {
    id: string;
    sku: string;
    name: string;
    price: string;
    description: string;
    available: boolean;
    featuredImage: string;
    images: Array<string>;
    options: Array<OptionInterface>;
    variants: Array<VariantInterface>;
}


export interface OptionInterface {
    id: string;
    name: string;
    position: number;
    selectedValue?: OptionValuInterface;
    values?: Array<OptionValuInterface>;
}

export interface OptionValuInterface {
    id: string;
    name: string;
    shortCode: string;
}

export interface VariantInterface {
    id: string;
    sku: string;
    name: string;
    price: string;
    quantity: number;
    available: boolean;
    options: Array<OptionInterface>;
}

