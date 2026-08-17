import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegistroPage } from "./pages/RegistroPage";
import { Service } from "./pages/Services";
import { Aditional } from "./pages/AdditionalService";
import Employer from "./pages/Employer"


import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
         <Route path="/service" element={<Service />} />
         <Route path="/aditionalService" element={<Aditional />} />
           <Route path="/empleado" element={<Employer />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
