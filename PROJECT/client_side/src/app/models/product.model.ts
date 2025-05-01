export interface Product {
    _id: string;
    libelle: string;
    prix: number;
    image: string;
    quantity: number; // Make quantity required
  }