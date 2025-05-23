import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Navigate } from "react-router-dom";
import { JSX } from "react";

interface Props {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
