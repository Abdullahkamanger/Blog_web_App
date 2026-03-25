import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 className="text-9xl font-black text-slate-200">404</h1>
    <p className="text-2xl font-bold text-slate-900 -mt-8 relative z-10 bg-white px-4">Lost in the digital woods?</p>
    <Link to="/" className="mt-6 text-indigo-600 font-bold hover:underline">Go back home</Link>
  </div>
);

export default NotFound;
