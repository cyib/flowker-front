import { type FC, type CSSProperties } from 'react';
import '../../styles/App/Dashboard.css';
import { HiOutlineCode } from "react-icons/hi";
import { FaCubes } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa6";
import { MdHttp } from "react-icons/md";
import { FaSliders } from "react-icons/fa6";
import DashNavbar from './Navbar';
import SideMenuItem from '../../Components/Basic/SideMenuItem';
import Endpoints from './Endpoints/Endpoints';
import { IoMdSettings } from 'react-icons/io';
import Environments from './Environments/Environments';
import Settings from './Settings/Settings';
import Repository from './Repository/Repository';

const Dashboard: FC<any> = ({ page }: { page: 'endpoints'|'repository'|'environments'|'settings'|null }) => {
  console.log(page);
  return (
    <div className="__dashboard__">
      <DashNavbar/>
      <div className='dash-container'>
        <div className='side-menu no-select'>
          <SideMenuItem icon={<MdHttp size={30} color={'white'}/>} text={'Endpoints'} to={'/'}/>
          <SideMenuItem icon={<FaCubes size={30} color={'white'}/>} text={'Repository'} to={'/repository'}/>
          <SideMenuItem icon={<FaSliders size={30} color={'white'}/>} text={'Environments'} to={'/environments'}/>
          <SideMenuItem icon={<IoMdSettings size={30} color={'white'}/>} text={'Settings'} to={'/settings'}/>
        </div>
        <div className='content-container'>
          {!page || page == 'endpoints' ? <Endpoints/> : <></>}
          {page == 'repository' ? <Repository/> : <></>}
          {page == 'environments' ? <Environments/> : <></>}
          {page == 'settings' ? <Settings/> : <></>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
