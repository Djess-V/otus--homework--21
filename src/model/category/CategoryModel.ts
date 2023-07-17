import { IConvertCategory } from "../../services/convertCategory";
import { ICategory } from "./Category";

abstract class CategoryModel {
  abstract getAll(userId: string): Promise<IConvertCategory[] | null>;

  abstract create(userId: string, category: ICategory): Promise<string | null>;

  abstract delete(userId: string, id: string): Promise<boolean>;
}

export default CategoryModel;
