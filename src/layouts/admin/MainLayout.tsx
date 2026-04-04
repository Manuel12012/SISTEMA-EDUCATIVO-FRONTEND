import Sidebar from "../../components/SideBars/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen bg-white p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
