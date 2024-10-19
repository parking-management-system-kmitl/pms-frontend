import React from "react";
import PageCotainer from "../PageCotainer";
import { DemoRedux } from "../../features/demoRedux";

function DemoReduxPage() {
  return (
    <PageCotainer>
        <h1 className="text-3xl font-bold">Todos list</h1>
      <DemoRedux />
    </PageCotainer>
  );
}

export default DemoReduxPage;
