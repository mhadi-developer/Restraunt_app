
export type MenuItem = {
  id: number;
  itemName: string;
  categoryName: string;
  itemDescription: string;
  itemPrice: number;
  badge?: string;
  itemImages : itemImage[]
  
}
type   itemImage = {
  id: number,
  secure_url: string,
  public_id: string,
  itemId: number
}

