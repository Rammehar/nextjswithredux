import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  SerializedError,
} from "@reduxjs/toolkit";

type StatusType = "idle" | "loading" | "succeeded" | "failed";

export interface CourseState {
  loading: StatusType;
  error: string | null;
}

const initialCourseState: CourseState = {
  loading: "idle",
  error: null,
};

export const getCourses = createAsyncThunk(
  "course/getCourses",
  async (req, thunkAPI) => {
    console.log("Welcome to getCourses");
  }
);

export const courseSlice = createSlice({
  name: "course",
  initialState: initialCourseState,
  reducers: {},
});

export default courseSlice.reducer;
