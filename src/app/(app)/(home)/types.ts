import { Category } from "@/payload-types";

export interface CustomCategory extends Omit<Category, 'subcategories'> {
  subcategories?: CustomCategory[];
}
