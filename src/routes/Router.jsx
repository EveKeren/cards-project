import React from "react";
import { Route, Routes } from "react-router-dom";
import CardsPage from "../pages/CardsPage";
import FavoriteCardsPage from "../pages/FavoriteCardsPage";
import MyCardsPage from "../pages/MyCardsPage";
import AboutPage from "../pages/AboutPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ErrorPage from "../pages/ErrorPage";
import SandboxPage from "../pages/SandboxPage";
import ROUTES from "./routesDict";
import CreateCardForm from "./../cards/components/CreateCardForm.jsx";
import EditCardForm from "./../cards/components/EditCardForm";
import DebugPage from "../pages/Debugpage.jsx";
export default function Router() {
  return (
    <Routes>
      <Route path={ROUTES.root} element={<CardsPage />} />
      <Route path="/cards/edit/:id" element={<EditCardForm />} />
      <Route path={ROUTES.createCard} element={<CreateCardForm />} />
      <Route path={ROUTES.favorite} element={<FavoriteCardsPage />} />
      <Route path={ROUTES.myCards} element={<MyCardsPage />} />
      <Route path={ROUTES.about} element={<AboutPage />} />
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.register} element={<RegisterPage />} />
      <Route path={ROUTES.sandbox} element={<SandboxPage />} />
      <Route path={ROUTES.DebugPage} element={<DebugPage />} />
      <Route path="/*" element={<ErrorPage />} />
    </Routes>
  );
}
