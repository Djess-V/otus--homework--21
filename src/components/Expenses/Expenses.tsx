import React, { FC, FormEvent, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { createExpense } from "../../model/expense/Expense";
import { RootState } from "../../store/store";
import { addZero } from "../../services/serviceFunctions";
import { expenseStorage } from "../../model/storage";
import { addExpense } from "../../store/slices/sliceExpenses";
import "./Expenses.css";
import { ISubcategory } from "../../model/category/Category";

const Expenses: FC = () => {
  const now = new Date();
  const [selectedCategory, setSelectedCategory] = useState({
    value: "",
    label: "",
  });
  const [selectedSubcategory, setSelectedSubcategory] = useState({
    value: "",
    label: "",
  });
  const [date, setDate] = useState(
    `${now.getFullYear()}-${addZero(now.getMonth() + 1)}-${addZero(
      now.getDate(),
    )}`,
  );
  const [amount, setAmount] = useState("0");
  const [message, setMessage] = useState("");
  const categories = useSelector((store: RootState) => store.categories);
  const user = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch();

  const categoriesForSelection = useMemo(
    () => categories.map((el) => ({ value: el.id, label: el.name })),
    [categories],
  );

  const subcategoriesForSelection = useMemo(
    () =>
      (
        categories.find((el) => el.id === selectedCategory.value)
          ?.subcategories || []
      ).map((element: ISubcategory) => ({
        value: element.id,
        label: element.name,
      })),
    [categories, selectedCategory],
  );

  const clearForm = () => {
    setSelectedCategory({ value: "", label: "" });
    setSelectedSubcategory({ value: "", label: "" });
    setDate(
      `${now.getFullYear()}-${addZero(now.getMonth() + 1)}-${addZero(
        now.getDate(),
      )}`,
    );
    setAmount("0");
  };

  const onFormSubmit = async (evt: FormEvent) => {
    evt.preventDefault();

    if (!selectedCategory.value) {
      setMessage("Be sure to choose a category!");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      return;
    }

    const expense = createExpense(
      new Date(date).getTime(),
      selectedCategory.value,
      selectedSubcategory.value,
      Number(amount),
    );

    if (user.userId) {
      const expenseId = await expenseStorage.create(user.userId, expense);

      if (expenseId) {
        dispatch(addExpense(expense));
        clearForm();
        setMessage("Expenses added!");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    }
  };

  return (
    <div className="_container">
      <div className="expenses">
        <h2 className="expenses__title">Add expenses:</h2>
        <form
          className="expenses__form form-expenses"
          onSubmit={onFormSubmit}
          name="expenses-form"
        >
          <label className="expenses__form_label" htmlFor="category">
            Category:
          </label>
          <Select
            inputId="category"
            placeholder="Select"
            value={selectedCategory}
            onChange={(e) => {
              if (e) {
                setSelectedCategory(e);
              }
            }}
            options={categoriesForSelection}
          />
          <label className="expenses__form_label" htmlFor="subcategory">
            Subcategory:
          </label>
          <Select
            inputId="subcategory"
            placeholder="Select"
            value={selectedSubcategory}
            onChange={(e) => {
              if (e) {
                setSelectedSubcategory(e);
              }
            }}
            options={subcategoriesForSelection}
          />
          <label className="expenses__form_label" htmlFor="eventDate">
            Date:
          </label>
          <input
            data-testid="date"
            className="expenses__form_input _input"
            type="date"
            onChange={(e) => setDate(e.target.value)}
            value={date}
            name="date"
            id="date"
            min="2000-01-01"
            max="2099-12-31"
            required
          />
          <label className="expenses__form_label" htmlFor="amount">
            Amount:
          </label>
          <input
            className="expenses__form_input _input"
            type="number"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            name="amount"
            id="amount"
            min="0"
            step="0.01"
            required
          />
          <p className="expenses__form_message">{message}</p>
          <div className="form-expenses__buttons">
            <button
              className="form-expenses__buttons_button _button"
              type="button"
              onClick={clearForm}
            >
              Clear form
            </button>
            <button
              className="form-expenses__buttons_button _button"
              type="submit"
            >
              Add cost
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Expenses;
