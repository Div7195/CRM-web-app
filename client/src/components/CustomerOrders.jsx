import '../css/orders.css'
import Sidebar from './Sidebar'
import { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
const CustomerOrders = () => {
    const [reload, setReload] = useState(false)
const {customerId} = useParams()
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,

};

    
    const [orders, setOrders] = useState([])
    

      
      useEffect(() => {
        
        const myFunction = async() => {
            const url1 = `https://xeno-task.onrender.com/getOrders?customer=${customerId}`;
            const settings = {
            method: 'GET',
            credentials: "include",
            };
            
        
        try {
            const fetchResponse = await fetch(url1, settings);
            const response = await fetchResponse.json();
            setOrders(response.result)
            
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
                       
                            <div className='reload' onClick={() => {reload === true?setReload(false):setReload(true)}}>Reload Data</div>
                            <div className='list-box'>
                                {
                                    orders && orders.length > 0 ? 
                                    orders.map(e => (
                                        <>
                                        <div className='list-item-box'>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div className='item-titlee'>
                                                    Customer Id:
                                                </div>

                                                <div className='item-value-1'>
                                                    {e.customerId}
                                                </div>
                                            </div>
                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div className='item-titlee'>
                                                    Customer name:
                                                </div>

                                                <div className='item-value-1'>
                                                    {e.customerName}
                                                </div>
                                            </div>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div className='item-titlee'>
                                                    Total amount:
                                                </div>

                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'600',
                                                    marginLeft:'5px'
                                                }}>
                                                    {e.orderTotalAmount}
                                                </div>
                                            </div>

                                            

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div className='item-titlee'>
                                                    Date of order:
                                                </div>

                                                <div className='item-value-2'>
                                                    {new Date(e.orderDateStamp).toLocaleString('en-US', options)};
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

export default CustomerOrders