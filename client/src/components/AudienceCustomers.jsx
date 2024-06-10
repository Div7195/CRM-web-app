import '../css/customers.css'
import Sidebar from './Sidebar'
import { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect } from 'react';
import { useParams } from "react-router-dom";
const AudienceCustomers = () => {
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
    }, [])
      
    
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
            <div style={{
                display:'flex',
                flexDirection:'row',
                width:"100vw",
                height:'100vh'
            }}>

                        <Sidebar/>
                        <div style={{
                        width:'85%',
                        height:'100%',
                        display:'flex',
                        flexDirection:'column',
                        alignItems:'center'
                    }}
                    >
                        

                       
                            
                            <div style={{
                                display:'flex',
                                flexDirection:'column',
                                alignItems:'center',
                                justifyContent:'center',
                                width:'50%',
                                marginTop:'10px'
                            }}>
                                {
                                    customers && customers.length > 0 ? 
                                    customers.map(e => (
                                        <>
                                        <div style={{
                                            width:'100%',
                                            display:'flex',
                                            flexDirection:'column',
                                            padding:'5px',
                                            border:'2px solid black',
                                            borderRadius:'5px',
                                            background:'#cee3f6',
                                            marginTop:'10px'
                                        }}>
                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'750',
                                                    color:'#702cf6'
                                                }}>
                                                    Name:
                                                </div>

                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'600',
                                                    marginLeft:'10px'
                                                }}>
                                                    {e.customerName}
                                                </div>
                                            </div>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'750',
                                                    color:'#702cf6'
                                                }}>
                                                    Email:
                                                </div>

                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'600',
                                                    marginLeft:'10px'
                                                }}>
                                                    {e.customerEmail}
                                                </div>
                                            </div>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'750',
                                                    color:'#702cf6'
                                                }}>
                                                    Total spend:
                                                </div>

                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'600',
                                                    marginLeft:'10px'
                                                }}>
                                                    {e.customerTotalSpend}
                                                </div>
                                            </div>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'750',
                                                    color:'#702cf6'
                                                }}>
                                                    Total visits:
                                                </div>

                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'600',
                                                    marginLeft:'10px'
                                                }}>
                                                    {e.customerTotalVisits}
                                                </div>
                                            </div>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'750',
                                                    color:'#702cf6'
                                                }}>
                                                    Last visit date:
                                                </div>

                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'600',
                                                    marginLeft:'10px'
                                                }}>
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