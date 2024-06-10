import '../css/campaigns.css'
import Sidebar from './Sidebar'
import { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect } from 'react';
import CampaignIcon from '@mui/icons-material/Campaign';
const Campaigns = () => {
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
    const [message, setMessage] = useState('')
    const [email, setEmail] = useState({
        audienceId:'',
        subject:'',
        messageBody:'',
        
    })
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [campaigns, setCampaigns] = useState([])
    const [audiences, setAudiences] = useState([])
    const openAddForm = (id, name) => {
        setIsPopupVisible(true)
        
    }   
    const closeAddForm = (e) => {
        if (e.target.className.includes('popup-container')) {
          setIsPopupVisible(false);
        }
      };

    const onValueChangeSecond = (e) => {
        setEmail({...email, [e.target.name] : e.target.value})
        console.log(email)
      }
    const onSelectValueChange = (e) => {
        setEmail({...email, audienceId:e.target.value})
        console.log(newOrder)
    }


    const sendCampaignApi = async() =>{
        let obj = {
            audienceId:email.audienceId,
            subject:email.subject,
            messageBody:email.messageBody
        }
        const settings = {
         method: "POST",
         body: JSON.stringify(obj),
         headers: {
             "Content-type": "application/json; charset=UTF-8"
         },
         credentials: "include",
         }
         try {
             console.log(settings.body)
             const fetchResponse = await fetch(`http://localhost:8000/sendEmails`, settings);
             const response = await fetchResponse.json();
             console.log(response.msg)
             setMessage(response.msg)
            
             setTimeout(() => {
                setMessage("")
                setEmail({
                    audienceId:'',
                    subject:'',
                    messageBody:'',
                 })
                 setIsPopupVisible(false)
             }, 1500);
            
             
         } catch (e) {
            //  setError('Something went wrong, please try again later');
             return e;
         }    
     }
      
      useEffect(() => {
        
        const myFunction = async() => {
            const url1 = `http://localhost:8000/getAllCampaigns?audienceId=nil`;
            const settings = {
            method: 'GET',
            credentials: "include",
            };
            const url2 = "http://localhost:8000/getAllAudiences"
        
        try {
            const fetchResponse = await fetch(url1, settings);
            const response = await fetchResponse.json();
            setCampaigns(response.campaigns)
            const fetchResponse2 = await fetch(url2, settings);
            const response2 = await fetchResponse2.json();
            console.log(response2.audiences)
            setAudiences(response2.audiences)
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
            <div className='main-box'>

                        <Sidebar/>
                        <div className='main-content-box'
                    >
                        <div className='choose-button' onClick={() => {openAddForm()}}>
                                <CampaignIcon style={{
                                fontSize:"40px",
                                
                              }}
                              />  Send a campaign
                        </div>

                        <div onClick={(e) => {closeAddForm(e)}}>
                        <div className={`popup-container ${isPopupVisible ? 'show' : ''}`} >
                            <div className="form-container" onClick={(e) => e.stopPropagation()}>
                                <h2 style={{ fontFamily: 'AktivGrotesk-Bold',  textAlign:'center' }}>Send a new campaign</h2>
                                <form >
                                
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                    <select className='fname' placeholder="Select audience" name='audienceId' id='fname' onChange={(e)=>{onSelectValueChange(e)}} >

                                        {
                                            audiences && audiences.length > 0?
                                            audiences.map(e => (
                                                <>
                                            <option style={{
                                                background:'white',
                                                color:'black',
                                            }}
                                            
                                            value={e._id}
                                            >
                                                {`${e.name} - ID:${e._id}`}
                                            </option>
                                            </>
                                            ))
                                            

                                            :
                                            <></>
                                        }
                                    </select>
                                        
                                        

                                    {/* <input className="fname"  placeholder="Enter customer id*" type="text" name="customerId" id='fname' onChange={(e) => {onValueChange(e)}} /> */}
                                    <input className="lname" placeholder="Enter subject*" type="text" name="subject" onChange={(e) => {onValueChangeSecond(e)}}/>
                                    <input className="lname" placeholder="Enter message body*" type="text" name="messageBody" onChange={(e) => {onValueChangeSecond(e)}}/>
                                </div>
                                {
                                    message !== ""?
                                    <>
                                    <h2>{message}</h2>
                                    </>
                                    
                                    :
                                    <></>
                                }
                                <div className='btn' onClick={sendCampaignApi}>Send email</div>
                                </form>
                            </div>
                            </div>
                        </div>
                            
                            <div className='list-box'>
                                {
                                    campaigns && campaigns.length > 0 ? 
                                    campaigns.map(e => (
                                        <>
                                        <div className='list-box-item'>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div className='item-titlee'>
                                                    Audience Id:
                                                </div>

                                                <div className='item-value-1'>
                                                    {e.audienceId}
                                                </div>
                                            </div>
                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div className='item-titlee'>
                                                    Audience name:
                                                </div>

                                                <div className='item-value-1'>
                                                    {e.audienceName}
                                                </div>
                                            </div>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div className='item-titlee'>
                                                    Subject:
                                                </div>

                                                <div className='item-value-1'>
                                                    {e.subject}
                                                </div>
                                            </div>
                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row',
                                            }}>
                                                <div className='item-titlee'>
                                                    Message body:
                                                </div>

                                                <div className='item-value-4'>
                                                    {e.messageBody}
                                                </div>
                                            </div>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row',
                                            }}>
                                                <div className='item-titlee'>
                                                    Audience Size:
                                                </div>

                                                <div className='item-value-3'>
                                                    {e.audienceSize}
                                                </div>
                                            </div>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row',
                                            }}>
                                                <div className='item-titlee'>
                                                    Sent%:
                                                </div>

                                                <div className='item-value-3'>
                                                    {e.sentPercentage}
                                                </div>
                                            </div>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row',
                                            }}>
                                                <div className='item-titlee'>
                                                    Failed%:
                                                </div>

                                                <div className='item-value-3'>
                                                    {e.failedPercentage}
                                                </div>
                                            </div>

                                            

                                            

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row'
                                            }}>
                                                <div className='item-titlee'>
                                                    Date:
                                                </div>

                                                <div className='item-value-2'>
                                                    {new Date(e.date).toLocaleString('en-US', options)};
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

export default Campaigns