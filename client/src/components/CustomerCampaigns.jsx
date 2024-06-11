import '../css/campaigns.css'
import Sidebar from './Sidebar'
import { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect } from 'react';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useNavigate, useParams } from 'react-router-dom';
const CustomerCampaigns = () => {
    const [reload, setReload] = useState(false)
    const navigate = useNavigate()
    const {customerId} = useParams()
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


      
      useEffect(() => {
        
        const myFunction = async() => {
            const url1 = `https://xeno-task.onrender.com/getAllCampaigns?customerId=${customerId}`;
            const settings = {
            method: 'GET',
            credentials: "include",
            };
            const url2 = "https://xeno-task.onrender.com/getAllAudiences"
        
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

export default CustomerCampaigns