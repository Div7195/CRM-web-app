import '../css/customers.css'
import Sidebar from './Sidebar'
import { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Customers = () => {
    const [reload, setReload] = useState(false)
    const navigate = useNavigate()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        hour12: true,
      
      };
    const [newCustomer, setNewCustomer] = useState({
        customerName:'',
        customerEmail:'',
        
    })
    const [isPopupVisible, setIsPopupVisible] = useState(false);
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
        setNewCustomer({...newCustomer, [e.target.name]:e.target.value})
        console.log(newCustomer)
    }


      const addNewCustomerApi = async() =>{
        
        const settings = {
         method: "POST",
         body: JSON.stringify(newCustomer),
         headers: {
             "Content-type": "application/json; charset=UTF-8"
         },
         credentials: "include",
         }
         try {
             console.log(settings.body)
             const fetchResponse = await fetch(`https://xeno-task.onrender.com/addCustomer`, settings);
             const response = await fetchResponse.json();
             setNewCustomer({
                customerName:'',
                customerEmail:'',
                
            });
            setIsPopupVisible(false)
             
         } catch (e) {
            //  setError('Something went wrong, please try again later');
             return e;
         }    
     }
      
      useEffect(() => {
        
        const myFunction = async() => {
            const url = `https://xeno-task.onrender.com/getCustomers?audienceId=nil`;
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
                        <div className='main-content-box'>

                            <div className='temp-div'>
                                <div className='reload'
                                onClick={() => {reload === true?setReload(false):setReload(true)}}
                                >Reload data</div>
                                <div className='choose-button' onClick={() => {openAddForm()}}>
                                        <AddCircleIcon style={{
                                        fontSize:"40px",
                                        
                                    }}
                                    />  Add a customer
                                </div>
                            </div>
                            
                           
                            
                           
                           
                        
                        

                        <div onClick={(e) => {closeAddForm(e)}}>
                        <div className={`popup-container ${isPopupVisible ? 'show' : ''}`} >
                            <div className="form-container" onClick={(e) => e.stopPropagation()}>
                                <h2 style={{ fontFamily: 'AktivGrotesk-Bold',  textAlign:'center' }}>Add a new customer</h2>
                                <form >
                                
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                    <input className="fname"  placeholder="Enter name*" type="text" name="customerName" id='fname' onChange={(e) => {onValueChange(e)}} />
                                    <input className="lname" placeholder="Enter email*" type="email" name="customerEmail" id='lname'onChange={(e) => {onValueChange(e)}}/>
                                </div>
                                
                                <div className='btn' onClick={addNewCustomerApi}>Add customer</div>
                                </form>
                            </div>
                            </div>
                        </div>
                            
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

                                            <div className='btns-box'>
                                                <div className='bottom-btn' onClick={() => {navigate(`/customer/${e._id}/orders`)}}>
                                                    Get orders
                                                </div>


                                                <div className='bottom-btn' onClick={() => {navigate(`/customer/${e._id}/commslog`)}}>
                                                    Get comms log
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

export default Customers