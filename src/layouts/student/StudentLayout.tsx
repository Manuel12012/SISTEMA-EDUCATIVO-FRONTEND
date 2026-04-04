import Sidebar from "../../components/SideBars/SideBarStudent";
import { Outlet } from "react-router-dom";

const StudentLayout = () =>{
    return(
        <div className="flex">
            <Sidebar/>

            <main className="flex-1 ml-64 min-h-screen bg-white p-6">
                <Outlet/>
            </main>
        </div>
    )
}

export default StudentLayout;