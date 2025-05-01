export interface Order {
    _id: string;
    client: {
      nom: string;
      prenom: string;
      email: string;
    };
    products: {
      product: {
        libelle: string;
        prix: number;
        image: string;
      };
      quantity: number;
    }[];
    date_cmd: string;
  }