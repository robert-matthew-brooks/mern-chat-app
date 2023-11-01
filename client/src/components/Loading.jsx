import LoadingImg from '../assets/loading.svg';
import './Loading.css';

export default function Loading({ isLoading, children }) {
  return (
    <>
      <div className="Loading" style={{ display: !isLoading && 'none' }}>
        {<img src={LoadingImg} />}
      </div>
      {children}
    </>
  );
}
