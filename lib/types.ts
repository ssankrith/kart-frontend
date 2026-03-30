/** Mirrors kart-backend internal/api/types.go wire format */

export type ImageDTO = {
  thumbnail: string;
  mobile: string;
  tablet: string;
  desktop: string;
};

export type Product = {
  id: string;
  image?: ImageDTO;
  name: string;
  category: string;
  price: number;
};

/** Cart line with embedded product snapshot for display */
export type CartLine = {
  productId: string;
  quantity: number;
  product: Product;
};

export type OrderLineIn = {
  productId: string;
  quantity: number;
};

export type OrderReq = {
  items: OrderLineIn[];
  couponCode?: string | null;
};

export type OrderItemOut = {
  productId: string;
  quantity: number;
};

export type OrderDTO = {
  id: string;
  items: OrderItemOut[];
  couponCode?: string;
  products: Product[];
};

export type ErrorBody = {
  code: string;
  message: string;
};
