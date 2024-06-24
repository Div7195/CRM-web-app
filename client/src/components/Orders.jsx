import '../css/orders.css'
import Sidebar from './Sidebar'
import { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect } from 'react';
const Orders = () => {
const [reload, setReload] = useState(false)
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


    const [newOrder, setNewOrder] = useState({
        customerId:'',
        orderTotalAmount:'',
        
    })
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [orders, setOrders] = useState([])
    const [customers, setCustomers] = useState([])
    const openAddForm = () => {
        setIsPopupVisible(true)
    }   
    const closeAddForm = (e) => {
        if (e.target.className.includes('popup-container')) {
          setIsPopupVisible(false);
        }
      };

    const onValueChange = (e) => {
        setNewOrder({...newOrder, [e.target.name]:e.target.value})
        console.log(newOrder)
    }
    const onSelectValueChange = (e) => {
        setNewOrder({...newOrder, [e.target.name]:e.target.value})
        console.log(newOrder)
    }


      const addNewOrderApi = async() =>{
        
        const settings = {
         method: "POST",
         body: JSON.stringify(newOrder),
         headers: {
             "Content-type": "application/json; charset=UTF-8"
         },
         credentials: "include",
         }
         try {
             console.log(settings.body)
             const fetchResponse = await fetch(`https://crm-backend-2m9p.onrender.com/addOrder`, settings);
             const response = await fetchResponse.json();
             setNewOrder({
                customerId:'',
                orderTotalAmount:'',
                
            });
            setIsPopupVisible(false)
             
         } catch (e) {
            //  setError('Something went wrong, please try again later');
             return e;
         }    
     }
      
      useEffect(() => {
        
        const myFunction = async() => {
            const url1 = `https://crm-backend-2m9p.onrender.com/getOrders?customer=all`;
            const settings = {
            method: 'GET',
            credentials: "include",
            };
            const url2 = "https://crm-backend-2m9p.onrender.com/getCustomers"
        
        try {
            const fetchResponse = await fetch(url1, settings);
            const response = await fetchResponse.json();
            setOrders(response.result)
            const fetchResponse2 = await fetch(url2, settings);
            const response2 = await fetchResponse2.json();
            console.log(response2.customers)
            setCustomers(response2.customers)
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
                        <div className='temp-div'>
                                <div className='reload'
                                onClick={() => {reload === true?setReload(false):setReload(true)}}
                                >Reload data</div>
                        <div className='choose-button' onClick={() => {openAddForm()}}>
                                <AddCircleIcon style={{
                                fontSize:"40px",
                                
                              }}
                              />  Add an order
                        </div>
                        </div>
                        <div onClick={(e) => {closeAddForm(e)}}>
                        <div className={`popup-container ${isPopupVisible ? 'show' : ''}`} >
                            <div className="form-container" onClick={(e) => e.stopPropagation()}>
                                <h2 style={{ fontFamily: 'AktivGrotesk-Bold',  textAlign:'center' }}>Add a new order</h2>
                                <form >
                                
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                    <select className='fname' placeholde="Select customer" name='customerId' id='fname' onChange={(e)=>{onSelectValueChange(e)}} >

                                        {
                                            customers && customers.length > 0?
                                            customers.map(e => (
                                                <>
                                            <option style={{
                                                background:'white',
                                                color:'black',
                                            }}
                                            
                                            value={e._id}
                                            >
                                                {`${e.customerName} - ID:${e._id}`}
                                            </option>
                                            </>
                                            ))
                                            

                                            :
                                            <></>
                                        }
                                    </select>
                                        
                                        

                                    {/* <input className="fname"  placeholder="Enter customer id*" type="text" name="customerId" id='fname' onChange={(e) => {onValueChange(e)}} /> */}
                                    <input className="lname" placeholder="Enter total amount*" type="number" name="orderTotalAmount" id='lname'onChange={(e) => {onValueChange(e)}}/>
                                </div>
                                
                                <div className='btn' onClick={addNewOrderApi}>Add order</div>
                                </form>
                            </div>
                            </div>
                        </div>
                            
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

export default Orders