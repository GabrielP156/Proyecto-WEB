import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegistroPage } from "./pages/RegistroPage";
import { Service } from "./pages/Services";
import { Aditional } from "./pages/AdditionalService";
import Employer from "./pages/Employer"
import { Restrictions } from "./pages/Restrictions";
import { Schedules } from "./pages/Schedules";
import { DailyAgenda } from "./pages/DailyAgenda";
import { RutaProtegida } from "./components/RutaProtegida";
import { Citas } from "./pages/Citas";


import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
         <Route
           path="/service"
           element={
             <RutaProtegida>
               <Service />
             </RutaProtegida>
           }
         />
         <Route
           path="/aditionalService"
           element={
             <RutaProtegida>
               <Aditional />
             </RutaProtegida>
           }
         />
           <Route
             path="/empleado"
             element={
               <RutaProtegida rolesPermitidos={["Administrador", "Empleado"]}>
                 <Employer />
               </RutaProtegida>
             }
           />
        <Route
          path="/restricciones"
          element={
            <RutaProtegida rolesPermitidos={["Administrador", "Empleado"]}>
              <Restrictions />
            </RutaProtegida>
          }
        />
        <Route
          path="/horarios"
          element={
            <RutaProtegida>
              <Schedules />
            </RutaProtegida>
          }
        />
        <Route
          path="/agenda"
          element={
            <RutaProtegida rolesPermitidos={["Administrador"]}>
              <DailyAgenda />
            </RutaProtegida>
          }
        />
        <Route
          path="/citas"
          element={
            <RutaProtegida>
              <Citas />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
