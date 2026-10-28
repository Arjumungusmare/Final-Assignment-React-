import {
  createContext,
  useContext,
  useReducer,
} from "react";

const AuthContext = createContext();

const savedUser = JSON.parse(
  localStorage.getItem("currentUser") || "null"
);

const initialState = {
  isAuthenticated: Boolean(savedUser),
  currentUser: savedUser,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem(
        "currentUser",
        JSON.stringify(action.payload)
      );

      return {
        isAuthenticated: true,
        currentUser: action.payload,
      };

    case "LOGOUT":
      localStorage.removeItem("currentUser");

      return {
        isAuthenticated: false,
        currentUser: null,
      };

    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(
    authReducer,
    initialState
  );

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}