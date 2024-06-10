import '../css/orders.css'
import Sidebar from './Sidebar'
import { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CampaignIcon from '@mui/icons-material/Campaign';
const AudienceCampaigns = () => {
    const {audienceId} = useParams()
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
            const url1 = `http://localhost:8000/getAllCampaigns?audienceId=${audienceId}`;
            const settings = {
            method: 'GET',
            credentials: "include",
            };
            const url2 = "http://localhost:8000/getAllAudiences"
        
        try {
            const fetchResponse = await fetch(url1, settings);
            const response = await fetchResponse.json();
            setCampaigns(response.campaigns)

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
                                    campaigns && campaigns.length > 0 ? 
                                    campaigns.map(e => (
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
                                                    Audience Id:
                                                </div>

                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'600',
                                                    marginLeft:'10px'
                                                }}>
                                                    {e.audienceId}
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
                                                    Audience name:
                                                </div>

                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'600',
                                                    marginLeft:'10px'
                                                }}>
                                                    {e.audienceName}
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
                                                    Subject:
                                                </div>

                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'600',
                                                    marginLeft:'10px'
                                                }}>
                                                    {e.subject}
                                                </div>
                                            </div>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row',
                                            }}>
                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'750',
                                                    color:'#702cf6',
                                                    width:'22%'
                                                }}>
                                                    Message body:
                                                </div>

                                                <div style={{
                                                    width:'78%',
                                                    fontSize:'16px',
                                                    fontWeight:'500',
                                                    marginTop:'5px',
                                                    
                                                    display:'flex',
                                                }}>
                                                    {e.messageBody}
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
                                                    Date:
                                                </div>

                                                <div style={{
                                                    fontSize:'15px',
                                                    fontWeight:'600',
                                                    marginLeft:'10px',
                                                    marginTop:'5px'
                                                }}>
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

export default AudienceCampaigns


