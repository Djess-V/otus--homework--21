import React, { FC, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Subcategories from "../Subcategories/Subcategories";
import { createCategory } from "../../model/category/Category";
import { categoryStorage, expenseStorage } from "../../model/storage";
import { RootState } from "../../store/store";
import { IUserProfile } from "../../model/userProfile/FirebaseUserProfileModel";
import {
  addCategory,
  deleteCategory,
} from "../../store/slices/sliceCategories";
import {
  convertCategoryForStore,
  convertSubcategoriesForFirebase,
} from "../../services/convertCategory";
import "./Setting.css";
import { deleteExpensesOfDeletedCategory } from "../../store/slices/sliceExpenses";

const Setting: FC<Record<string, any>> = () => {
  const [subcategories, setSubcategories] = useState([] as string[]);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const user = useSelector((store: RootState) => store.user);
  const expenses = useSelector((store: RootState) => store.expenses);
  const dispatch = useDispatch();

  const onDeleteSubcategories = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const onAddSubcategories = (value: string) => {
    setSubcategories([...subcategories, value]);
  };

  const clearForm = () => {
    setCategoryName("");
    setSubcategories([]);
    setDescription("");
  };

  const onFormSubmit = async (evt: FormEvent) => {
    evt.preventDefault();

    const category = createCategory(
      categoryName,
      description,
      convertSubcategoriesForFirebase(subcategories),
    );

    const categoryId = await categoryStorage.create(
      (user as IUserProfile).userId,
      category,
    );

    if (categoryId) {
      setMessage("Category added!");
      dispatch(addCategory(convertCategoryForStore(category)));
    } else {
      setMessage("Error of category creation in Firebase!");
    }

    setTimeout(() => setMessage(""), 3000);

    clearForm();
  };

  const onClickDeleteButton = async (categoryId: string) => {
    if (user.userId) {
      const expensesIds = expenses
        .filter((expense) => expense.categoryId === categoryId)
        .map((item) => item.id);

      const deleted = await categoryStorage.delete(user.userId, categoryId);

      if (deleted) {
        dispatch(deleteCategory(categoryId));
      }

      const expensesDeleted =
        await expenseStorage.deleteExpensesOfDeletedCategory(
          user.userId,
          expensesIds,
        );

      if (expensesDeleted) {
        dispatch(deleteExpensesOfDeletedCategory(categoryId));
      }
    }
  };

  const categories = useSelector((store: RootState) => store.categories);

  const categoryList = categories.map((category, index) => (
    <li
      key={category.id}
      className="category-list__category"
      data-testid="newCategory"
    >
      {category.name}{" "}
      <button
        className="category-list__category_delete-button"
        onClick={() => onClickDeleteButton(category.id)}
        data-testid={`deleteCategory-${index}`}
      ></button>
      {!!category.subcategories.length && (
        <ul>
          {category.subcategories.map((subcategory) => (
            <li
              key={subcategory.id}
              className="category-list__subcategory"
              data-testid="newSubcategory"
            >
              {subcategory.name}
            </li>
          ))}
        </ul>
      )}
    </li>
  ));

  return (
    <div className="category-container _container">
      <div className="category">
        <h2 className="category__title">Create category:</h2>
        <form
          className="category__form form-category"
          onSubmit={onFormSubmit}
          name="category-form"
        >
          <label className="category__form_label" htmlFor="category">
            Category:
          </label>
          <input
            className="category__form_input _input"
            type="text"
            onChange={(e) => setCategoryName(e.target.value)}
            value={categoryName}
            name="category"
            id="category"
            minLength={3}
            required
            data-testid="category"
          />
          <label className="category__form_label" htmlFor="subcategories">
            Subcategory:
          </label>
          <Subcategories
            name="subcategories"
            value={subcategories}
            placeholder="Press ENTER to add"
            onAddValue={onAddSubcategories}
            onDeleteValue={onDeleteSubcategories}
          />
          <label className="category__form_label" htmlFor="description">
            Description:
          </label>
          <textarea
            className="category__form_description _input"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            name="description"
            id="description"
            data-testid="description"
          />
          {message && <p className="category__form_message">{message}</p>}
          <div className="form-category__buttons">
            <button
              className="form-category__buttons_button _button"
              type="button"
              onClick={clearForm}
            >
              Clear form
            </button>
            <button
              className="form-category__buttons_button _button"
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </div>
      <div className="category-list">
        <h3 className="category-list__title">The existing categories:</h3>
        {categoryList.length ? (
          <ul>{categoryList}</ul>
        ) : (
          <p className="category-list__message">No categories!</p>
        )}
      </div>
    </div>
  );
};

export default Setting;
