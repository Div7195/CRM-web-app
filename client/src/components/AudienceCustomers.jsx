import '../css/customers.css'
import Sidebar from './Sidebar'
import { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect } from 'react';
import { useParams } from "react-router-dom";
const AudienceCustomers = () => {
    const [reload, setReload] = useState(false)
    const {audienceId} = useParams();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        hour12: true,
      
      };
    
    
    const [customers, setCustomers] = useState([])
    
      
      useEffect(() => {
        
        const myFunction = async() => {
            const url = `http://localhost:8000/getCustomers?audienceId=${audienceId}`;
            const settings = {
            method: 'GET',
            credentials: "include",
            };
        
        try {
            const fetchResponse = await fetch(url, settings);
            const response = await fetchResponse.json();
            setCustomers(response.customers)
            
            } catch (e) {
            console.log(e);
            }
    
        }
        
        myFunction()
    }, [reload])
      
    
    return(
        <>
        <div style={{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
            }}>
            <div className='header'>
                <div className='title'>
                Xeno Task - Mini CRM
                </div>
            </div>
            <div className='main-box'>

                        <Sidebar/>
                        <div className='main-content-box'
                    >

                        <div className='reload' onClick={() => {reload === true ? setReload(false) : setReload(true)}}>Reload Data</div>
                            <div className='list-box'>
                                {
                                    customers && customers.length > 0 ? 
                                    customers.map(e => (
                                        <>
                                        <div className='list-item-box'>
                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div className='item-title'>
                                                    Name:
                                                </div>

                                                <div className='item-value-1'>
                                                    {e.customerName}
                                                </div>
                                            </div>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div className='item-title'>
                                                    Email:
                                                </div>

                                                <div className='item-value-1'>
                                                    {e.customerEmail}
                                                </div>
                                            </div>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div className='item-title'>
                                                    Total spend:
                                                </div>

                                                <div className='item-value-1'>
                                                    {e.customerTotalSpend}
                                                </div>
                                            </div>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div className='item-title'>
                                                    Total visits:
                                                </div>

                                                <div className='item-value-1'>
                                                    {e.customerTotalVisits}
                                                </div>
                                            </div>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div className='item-title'>
                                                    Last visit date:
                                                </div>

                                                <div className='item-value-1'>
                                                    {new Date(e.lastVisitDate).toLocaleString('en-US', options)};
                                                </div>
                                            </div>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div>
                                                    {}
                                                </div>

                                                <div>
                                                    {}
                                                </div>
                                            </div>
                                        </div>
                                        </>
                                    ))

                                    :
                                    <>
                                    </>
                                }
                            </div>


                        

                        

                    </div>
            </div>
        </div>

        </>
    )
}

export default AudienceCustomers