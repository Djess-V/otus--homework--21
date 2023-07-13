import { ICategory } from "./Category";

abstract class CategoryModel {
  abstract getAll(userId: string): Promise<Record<string, ICategory> | null>;

  abstract create(userId: string, category: ICategory): Promise<string | null>;

  abstract delete(userId: string, id: string): Promise<boolean>;

  abstract deleteAll(userId: string): Promise<boolean>;
}

export default CategoryModel;
