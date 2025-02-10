import { Outlet } from "react-router";
import { Navbar } from "./components";

function App() {
   return (
      <div className="min-h-screen">
         <Navbar />
         <div className="absolute min-h-[calc(100vh-4.5rem)] p-4 bg-slate-200/20 top-18 w-full">
            <Outlet />
         </div>
      </div>
   );
}

export default App;
