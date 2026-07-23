import { HomeContent } from "../components/Home/HomeContent";
import { HomeOrdersSection } from "../components/Home/HomeOrders";
import Sidebar from "../components/SideBar";

export default function HomePage() {
    
    return (<div className="dashboard-layout">
        <Sidebar/>
        <div className="main-content">
<HomeContent />
        <HomeOrdersSection/>
        </div>
        
                
        </div>
        
    )
}