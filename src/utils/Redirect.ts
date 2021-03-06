import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Redirect({ to }: { to: any }) {
  let navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  });
  return null;
}

export{
  Redirect
}