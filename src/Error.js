import React from "react";
import { useRouteError } from "react-router";

export default function Error() {
  const err = useRouteError();
  console.log();
  return (
    <h1>
      {err.status}:{err.statusText}
    </h1>
  );
}
