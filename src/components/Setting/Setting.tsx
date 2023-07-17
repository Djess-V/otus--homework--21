import React, { FC, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Subcategories from "../Subcategories/Subcategories";
import { createCategory } from "../../model/category/Category";
import { categoryStorage } from "../../model/storage";
import "./Setting.css";
import store, { RootState } from "../../store/store";
import { IUserProfile } from "../../model/userProfile/UserProfileModel";
import {
  addCategory,
  deleteCategory,
} from "../../store/slices/sliceCategories";
import {
  convertCategoryForStore,
  convertSubcategoriesForFirebase,
} from "../../services/convertCategory";

const Setting: FC<Record<string, any>> = () => {
  const [subcategories, setSubcategories] = useState([] as string[]);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const user = useSelector((st: RootState) => st.user);
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
      const deleted = await categoryStorage.delete(user.userId, categoryId);

      if (deleted) {
        dispatch(deleteCategory(categoryId));
      }
    }
  };

  const categories = useSelector((st: RootState) => st.categories);

  const categoryList = categories.map((category) => (
    <li key={category.id} className="category-list__category">
      {category.name}{" "}
      <button
        className="category-list__category_delete-button"
        onClick={() => onClickDeleteButton(category.id)}
      ></button>
      {!!category.subcategories.length && (
        <ul>
          {category.subcategories.map((subcategory) => (
            <li key={subcategory.id} className="category-list__subcategory">
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
