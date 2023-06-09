
import "./Home.scss"
import { axiosClient } from "../../utils/axiosClient";
import {useEffect} from "react"
import Navbar from "../../components/navbar/Navbar";
import {Outlet} from "react-router-dom"
import { useDispatch } from "react-redux";
import { getMyInfo } from "../../redux/slices/appConfigSlice";

const Home=()=>{
    
    const dispatch=useDispatch();

    useEffect(()=>{
        dispatch(getMyInfo());
    }, [])

    return(
        <>
        <Navbar/>
        <div className="Outlet" style={{marginTop:"60px"}}>
            <Outlet/>
        </div>
        </>
    )
}

export default Home;