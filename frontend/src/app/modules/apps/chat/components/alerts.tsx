import { FC, useEffect, useState } from 'react';
import { transitions, positions } from 'react-alert'
import { AlertTemplateProps } from 'react-alert';

export const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

export const AlertTemplate: FC<AlertTemplateProps> = ({ message, close }) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    close();
  };

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
      close();
    }, 5000);
  }, []);

  return (
    <div className='bg-success' style={{ display: show ? 'block' : 'none' }}>
      {message}
      <button onClick={handleClose}>Close</button>
    </div>
  );
};
