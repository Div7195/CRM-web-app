import '../css/orders.css'
import Sidebar from './Sidebar'
import { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect } from 'react';
const Orders = () => {
    const isoTimestamp = '2024-06-07T13:41:09.063Z';
const date = new Date(isoTimestamp);

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
             const fetchResponse = await fetch(`http://localhost:8000/addOrder`, settings);
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
            const url1 = `http://localhost:8000/getOrders?customer=all`;
            const settings = {
            method: 'GET',
            credentials: "include",
            };
            const url2 = "http://localhost:8000/getCustomers"
        
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
                        <div className='choose-button' onClick={() => {openAddForm()}}>
                                <AddCircleIcon style={{
                                fontSize:"40px",
                                
                              }}
                              />  Add an order
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
                                
                                <button onClick={addNewOrderApi}>Add order</button>
                                </form>
                            </div>
                            </div>
                        </div>
                            
                            <div style={{
                                display:'flex',
                                flexDirection:'column',
                                alignItems:'center',
                                justifyContent:'center',
                                width:'50%',
                                marginTop:'10px'
                            }}>
                                {
                                    orders && orders.length > 0 ? 
                                    orders.map(e => (
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
                                                    Customer Id:
                                                </div>

                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'600',
                                                    marginLeft:'10px'
                                                }}>
                                                    {e.customerId}
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
                                                    Customer name:
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
                                                    Total amount:
                                                </div>

                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'600',
                                                    marginLeft:'10px'
                                                }}>
                                                    {e.orderTotalAmount}
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
                                                    Date of order:
                                                </div>

                                                <div style={{
                                                    fontSize:'15px',
                                                    fontWeight:'600',
                                                    marginLeft:'10px',
                                                    marginTop:'5px'
                                                }}>
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