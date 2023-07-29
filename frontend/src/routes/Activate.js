import { useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Activate() {
  const { uid, token } = useParams();

  useEffect(() => {
    fetch(
      '/users/activation/',
      {
        method: 'POST',
        body: JSON.stringify({
          uid,
          token,
        }),
      },
      [400]
    );
  }, []);

  return <Navigate to='/login' state={{ activated: true }} replace={true} />;
}
