
export type Category = {
  categoryName: string,
  id : number,
  categoryImage : CategoryImage
  
}
type CategoryImage = {
  id :  number,
  secure_url: string,
  public_id: string,
  
}