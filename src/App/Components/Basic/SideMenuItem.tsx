import { useCallback, type FC } from 'react';
import '../../styles/App/Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';

const SideMenuItem: FC<any> = ({ icon, text, to }) => {
  const navigate = useNavigate();
  const navigateToFlow = useCallback((href: string) => navigate(href, {replace: false}), [navigate]);

  return (
    <>
      <div className='item' onClick={() => navigateToFlow(to)}>
        <div className='item-name'>
          <div className='icon'>
            {icon}
          </div>
          <span>
            {text}
          </span>
        </div>
      </div>
    </>
  );
};

export default SideMenuItem;
