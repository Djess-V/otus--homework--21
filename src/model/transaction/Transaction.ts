type TrasactionOption = {
  id: string;
  eventDate: number;
  category: string;
  subCategory: string;
  amount: number;
};

class Transaction {
  id: string;

  eventDate: number;

  category: string;

  subCategory: string;

  amount: number;

  constructor(option: TrasactionOption) {
    const { id, eventDate, category, subCategory, amount } = option;
    this.id = id;
    this.eventDate = eventDate;
    this.category = category;
    this.subCategory = subCategory;
    this.amount = amount;
  }
}

export default Transaction;
