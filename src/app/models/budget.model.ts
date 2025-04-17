export interface Budget{
  _id?: string;        // Optional since it's assigned by MongoDB
  category: string;    // Use TypeScript types (lowercase)
    limit:number;
    startDate:Date;
    endDate:Date;
}

