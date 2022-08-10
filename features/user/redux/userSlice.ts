import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  SerializedError,
} from "@reduxjs/toolkit";
import axios from "axios";
import { HYDRATE } from "next-redux-wrapper";

import { RootState } from "../../../app/store";
import axiosInstance from "../../../shared/infra/services/axiosInstance";
import { LoginDTO } from "../dtos/loginDTO";

import { User } from "../models/user";
import { userService } from "../services";

type StatusType = "idle" | "loading" | "succeeded" | "failed";

export interface UserState {
  user: User | null;
  accessToken: string;
  loading: StatusType;
  error: string | null;
}

const initialUserState: UserState = {
  user: null,
  accessToken: "",
  loading: "idle",
  error: null,
};

export interface UserCredentials {
  email: string;
  password: string;
}

//get user token by login
export const login = createAsyncThunk<
  LoginDTO,
  UserCredentials,
  { rejectValue: string }
>("user/login", async (credential, thunkAPI) => {
  //call backend api
  const result = await userService.login(credential.email, credential.password);

  if (result.isLeft()) {
    const error: string = result.value;
    return thunkAPI.rejectWithValue(error);
  } else {
    return result.value.getValue();
  }
});

//get user profile after login
export const getCurrentUserProfile = createAsyncThunk<
  User,
  void,
  { state: RootState }
>("user/getCurrentUserProfile", async (req, thunkAPI) => {
  try {
    const user = await userService.getCurrentUserProfile();
    return user;
  } catch (error) {
    if (!error.response) {
      throw error;
    }
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const register = createAsyncThunk<
  void,
  { firstName: string; email: string; password: string },
  { rejectValue: string }
>("user/register", async (data, thunkAPI) => {
  const result = await userService.register(
    data.firstName,
    data.email,
    data.password
  );
  if (result.isLeft()) {
    const error: string = result.value;
    return thunkAPI.rejectWithValue(error);
  }
});

// email verification
export const verifyEmail = createAsyncThunk<
  void,
  { token: string },
  { rejectValue: string }
>("user/verifyEmail", async (data, thunkAPI) => {
  const result = await userService.verifyEmail(data.token);
  if (result.isLeft()) {
    const error: string = result.value;
    return thunkAPI.rejectWithValue(error);
  }
});

//logout user
//TODO we need to add refresh Token functionality with radis db
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "user/logout",
  async (req, thunkAPI) => {
    const result = await userService.logout();
    if (result.isLeft()) {
      const error: string = result.value;
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const passwordChangeRequest = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>("user/passwordChangeRequest", async ({ email }, thunkAPI) => {
  //call backend api
  const result = await userService.passwordChangeRequest(email);
  if (result.isLeft()) {
    const error: string = result.value;
    return thunkAPI.rejectWithValue(error);
  }
});

export const changePassword = createAsyncThunk<
  void,
  { currentPassword: string; newPassword: string },
  { rejectValue: string }
>("user/changePassword", async (data, thunkAPI) => {
  const result = await userService.changePassword(
    data.currentPassword,
    data.newPassword
  );
  if (result.isLeft()) {
    const error: string = result.value;
    return thunkAPI.rejectWithValue(error);
  }
});

export const resetPassword = createAsyncThunk<
  void,
  { password: string; passwordChangeRequestId: string; token: string },
  { rejectValue: string }
>("user/resetPassword", async (req, thunkAPI) => {
  //call backend api
  const result = await userService.resetPassword(
    req.password,
    req.passwordChangeRequestId,
    req.token
  );
  if (result.isLeft()) {
    const error: string = result.value;
    return thunkAPI.rejectWithValue(error);
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    logoutLocally: (state, action) => {
      state.accessToken = "";
      state.user = null;
    },
    updateAccessToken(state, action: PayloadAction<{ token: string }>) {
      state.accessToken = action.payload.token;
    },
    reset: () => initialUserState,
  },
  extraReducers: (builder) => {
    builder

      .addCase(login.pending, (state, action: PayloadAction<void>) => {
        state.error = null;
        state.loading = "loading";
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = "failed";
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginDTO>) => {
        state.loading = "succeeded";
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })

      .addCase(register.pending, (state, action: PayloadAction<void>) => {
        state.error = null;
        state.loading = "loading";
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = "failed";
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<void>) => {
        state.loading = "succeeded";
        state.error = null;
      })

      .addCase(verifyEmail.pending, (state, action: PayloadAction<void>) => {
        state.error = null;
        state.loading = "loading";
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = "failed";
      })
      .addCase(verifyEmail.fulfilled, (state, action: PayloadAction<void>) => {
        state.loading = "succeeded";
        state.error = null;
      })

      .addCase(
        getCurrentUserProfile.pending,
        (state, action: PayloadAction<void>) => {
          state.loading = "loading";
        }
      )
      .addCase(getCurrentUserProfile.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })

      .addCase(
        getCurrentUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = "succeeded";
          state.user = action.payload;
        }
      )

      .addCase(logout.pending, (state, action: PayloadAction<void>) => {
        state.loading = "loading";
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })

      .addCase(logout.fulfilled, (state, action: PayloadAction<void>) => {
        state.loading = "succeeded";
        state.accessToken = "";
        state.user = null;
      })

      .addCase(
        passwordChangeRequest.pending,
        (state, action: PayloadAction<void>) => {
          state.loading = "loading";
        }
      )
      .addCase(passwordChangeRequest.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })

      .addCase(passwordChangeRequest.fulfilled, (state, action) => {
        state.loading = "succeeded";
      })
      .addCase(resetPassword.pending, (state, action: PayloadAction<void>) => {
        state.loading = "loading";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      .addCase(
        resetPassword.fulfilled,
        (state, action: PayloadAction<void>) => {
          state.loading = "succeeded";
        }
      )
      .addCase(changePassword.pending, (state, action: PayloadAction<void>) => {
        state.error = null;
        state.loading = "loading";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = "failed";
      })
      .addCase(
        changePassword.fulfilled,
        (state, action: PayloadAction<void>) => {
          state.loading = "succeeded";
          state.error = null;
        }
      );
  },
});

// Action creators are generated for each case reducer function
export const { logoutLocally, updateAccessToken, reset } = userSlice.actions;

export default userSlice.reducer;

//https://www.bezkoder.com/react-redux-login-example-toolkit-hooks/
//https://cloudnweb.dev/2021/02/modern-react-redux-tutotials-redux-toolkit-login-user-registration/

//https://stackoverflow.com/questions/68002829/redux-toolkit-with-typescript-cannot-dispatch-action-created-by-createasyncthun
