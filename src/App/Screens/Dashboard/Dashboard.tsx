import { type FC, type CSSProperties } from 'react';
import '../../styles/App/Dashboard.css';
import { Button, Col, Row } from 'react-bootstrap';
import Atoms from '../../Constants/Atoms';
import { GiCoffeeBeans } from "react-icons/gi";
import { HiOutlinePlusCircle, HiOutlineCode, HiDatabase, HiFolderOpen , HiSave } from "react-icons/hi";
import DashNavbar from './Navbar';
import SideMenuItem from '../../Components/Basic/SideMenuItem';
import Endpoints from './Endpoints/Endpoints';
import Libraries from './Libraries/Libraries';
import { IoMdSettings } from 'react-icons/io';
import { FaSeedling } from 'react-icons/fa';
import Databases from './Databases/Databases';
import Environments from './Environments/Environments';
import Settings from './Settings/Settings';

const Dashboard: FC<any> = ({ page }: { page: 'endpoints'|'libraries'|'databases'|'environments'|'settings'|null }) => {
  console.log(page);
  return (
    <div className="__dashboard__">
      <DashNavbar/>
      <div className='dash-container'>
        <div className='side-menu no-select'>
          <SideMenuItem icon={<HiOutlineCode size={30} color={'white'}/>} text={'Endpoints'} to={'/'}/>
          <SideMenuItem icon={<HiFolderOpen size={30} color={'white'}/>} text={'Libraries'} to={'/libraries'}/>
          <SideMenuItem icon={<FaSeedling size={30} color={'white'}/>} text={'Environments'} to={'/environments'}/>
          <SideMenuItem icon={<HiDatabase size={30} color={'white'}/>} text={'Databases'} to={'/databases'}/>
          <SideMenuItem icon={<IoMdSettings size={30} color={'white'}/>} text={'Settings'} to={'/settings'}/>
        </div>
        <div className='content-container'>
          {!page || page == 'endpoints' ? <Endpoints/> : <></>}
          {page == 'libraries' ? <Libraries/> : <></>}
          {page == 'databases' ? <Databases/> : <></>}
          {page == 'environments' ? <Environments/> : <></>}
          {page == 'settings' ? <Settings/> : <></>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
