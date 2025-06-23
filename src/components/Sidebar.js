// Barra lateral
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/sidebar.css';
import NavBar from './Nabar';
import TokenService from '@/utils/TokenService';

export default function Sidebar() {
  const router = useRouter();

  const links = [
    // { href: "/", label: "Resumen" },
    { href: "/pagesInfo/clients", label: "Clientes" },
    { href: "/pagesInfo/projects", label: "Proyectos" },
    { href: "/pagesInfo/deliverynotes", label: "Albaranes" },
    // { href: "/", label: "Proveedores" },
    // { href: "/", label: "Ajustes" },
  ];

  const handleLogout = () => {
    TokenService.clearToken();  
    // window.location.reload();
    // router.push('/user/onBoarding/login');
    router.replace("/user/onBoarding/login");

  };

  return (
    <aside className="sidebar">
      <NavBar links={links} />
      <button className="sidebar-footer-button" onClick={handleLogout}>Cerrar sesión</button>
    </aside>
  );
};

