import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;
function ProtectedRoute({ children }) {
  // 1 Load the authenticated user
  const { user, isLoading, isAuthenticated } = useUser();
  const navigate = useNavigate();

  // 2 if no authed user redirect to login
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate("/login");
    },
    [isAuthenticated, isLoading, navigate]
  );

  // 3 show a spinner while loading
  if (isLoading) return <Spinner />;

  // 4 if there is a user render the app
  return children;
}

export default ProtectedRoute;
