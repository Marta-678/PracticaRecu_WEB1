import React from "react";
import Link from "next/link";
import { getFetch } from "@/utils/handlerequests";
import OrderTable from "./OrderTable";


export default function ProjectsList({ projects }){

  return (

    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <OrderTable orders={projects}></OrderTable>
      <Link href={`/pagesInfo/projects/create`}>
        <span style={{ cursor: "pointer" }}>Crear Nuevo projecte</span>
      </Link>
    </div>

  );
};


