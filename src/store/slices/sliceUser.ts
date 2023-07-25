import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  userId: string | undefined;
  name: string | undefined;
}
const initialState: IUser = {
  userId: undefined,
  name: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<IUser>) => {
      state = action.payload;
      return state;
    },

    deleteUser: (state) => {
      state = {
        userId: undefined,
        name: undefined,
      };
      return state;
    },
  },
});

export const { addUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
