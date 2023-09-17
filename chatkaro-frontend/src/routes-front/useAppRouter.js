import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function useAppRouter() {
  const navigate = useNavigate();

  const routes = useMemo(
    () => ({
      navigateToHome: () => navigate("/"),
      navigateToChat: () => navigate("/chat"),
      
    }),
    [navigate]
  );

  return routes;
}

export default useAppRouter;