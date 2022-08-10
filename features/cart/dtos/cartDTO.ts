interface CartItemDTO {
    catalogItemId: string;
    title: string;
    level: string;
    trainerName: string;
    totalNumChapters: number;
    imageUrl: string;
    url: string;
    price: number;
  }
  export interface CartDTO {
    cartId: string;
    cartItems: CartItemDTO[];
    totalNumCartItems: number;
    cartPrice: number;
    isLocked: boolean;
  }
  