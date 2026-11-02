import Navbar from './navbar'; import Footer from './footer';
export default function SiteShell({children}) { return <><Navbar/>{children}<Footer/></>; }
