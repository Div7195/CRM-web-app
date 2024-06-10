import '../css/audiences.css'
import Sidebar from './Sidebar'
import { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Orders = () => {
    const navigate = useNavigate()
    const isoTimestamp = '2024-06-07T13:41:09.063Z';
const date = new Date(isoTimestamp);
const [audienceSize, setAudienceSize] = useState('')
const [message, setMessage] = useState('')
const [email, setEmail] = useState({
    audienceId:'',
    subject:'',
    messageBody:'',
    audienceName:''
})
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


    const [newAudience, setNewAudience] = useState({
        name: "",
        description: "",
        criteria: {
            minTotalSpend: '',
            minTotalVisits: '',
            lastMonthsNotVisited: '',
            operator1: '',
            operator2: ''
  }
        
    })
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isPopupVisibleSecond, setIsPopupVisibleSecond] = useState(false);
    const [audiences, setAudiences] = useState([])
    const openAddForm = () => {
        setIsPopupVisible(true)
    }   
    const openAddFormSecond = (id, name) => {
        setIsPopupVisibleSecond(true)
        setEmail({...email, audienceId:id, audienceName:name})
    }   
    const closeAddForm = (e) => {
        if (e.target.className.includes('popup-container')) {
          setIsPopupVisible(false);
        }
      };

      const closeAddFormSecond = (e) => {
        if (e.target.className.includes('popup-container')) {
            setIsPopupVisibleSecond(false);
        }
      };

      const onValueChangeSecond = (e) => {
        setEmail({...email, [e.target.name] : e.target.value})
        console.log(email)
      }

      const onValueChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'name' || name === 'description') {
          setNewAudience(prevState => ({
            ...prevState,
            [name]: value
          }));
          console.log(newAudience)
        } else {
          setNewAudience(prevState => ({
            ...prevState,
            criteria: {
              ...prevState.criteria,
              [name]: value
            }
          }));
          console.log(newAudience)
        }
      };
      
      const onSelectValueChange1 = (e) => {
        const { value } = e.target;
        setNewAudience(prevState => ({
          ...prevState,
          criteria: {
            ...prevState.criteria,
            operator1: value
          }
        }));
        console.log(newAudience)
      };
      
      const onSelectValueChange2 = (e) => {
        const { value } = e.target;
        setNewAudience(prevState => ({
          ...prevState,
          criteria: {
            ...prevState.criteria,
            operator2: value
          }
        }));
        console.log(newAudience)
      };

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
                    audienceName:''
                 })
                 setIsPopupVisibleSecond(false)
             }, 1500);
            
             
         } catch (e) {
            //  setError('Something went wrong, please try again later');
             return e;
         }    
     }
      const addNewAudienceApi = async() =>{
        
        const settings = {
         method: "POST",
         body: JSON.stringify(newAudience),
         headers: {
             "Content-type": "application/json; charset=UTF-8"
         },
         credentials: "include",
         }
         try {
             console.log(settings.body)
             const fetchResponse = await fetch(`http://localhost:8000/addAudience`, settings);
             const response = await fetchResponse.json();
             setAudiences([...audiences, newAudience])
             setNewAudience({
                name: "",
        description: "",
        criteria: {
            minTotalSpend: '',
            minTotalVisits: '',
            lastMonthsNotVisited: '',
            operator1: '',
            operator2: ''
            }
         });
            setIsPopupVisible(false)
             
         } catch (e) {
            //  setError('Something went wrong, please try again later');
             return e;
         }    
     }

     const checkNewAudienceSizeApi = async() =>{
        
        const settings = {
         method: "POST",
         body: JSON.stringify(newAudience.criteria),
         headers: {
             "Content-type": "application/json; charset=UTF-8"
         },
         
         }
         try {
             console.log(settings.body)
             const fetchResponse = await fetch(`http://localhost:8000/getAudienceSize`, settings);
             const response = await fetchResponse.json();
            setAudienceSize(response.audienceSize)
             
         } catch (e) {
            console.log(e)
            //  setError('Something went wrong, please try again later');
             return e;
         }    
     }
      
      useEffect(() => {
        
        const myFunction = async() => {
            const url1 = `http://localhost:8000/getAllAudiences`;
            const settings = {
            method: 'GET',
            credentials: "include",
            };
           
        
        try {
            const fetchResponse = await fetch(url1, settings);
            const response = await fetchResponse.json();
            setAudiences(response.audiences)
            
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
                              />  Add an audience
                        </div>



                        <div className='campaign-form-popup' onClick={(e) => {closeAddFormSecond(e)}}>
                        <div className={`popup-container ${isPopupVisibleSecond ? 'show' : ''}`} >
                            <div className="form-container" onClick={(e) => e.stopPropagation()}>
                                <h2 style={{ fontFamily: 'AktivGrotesk-Bold',  textAlign:'center' }}>Send a new campaign to {email.audienceName}</h2>
                                <form >
                                
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <input className="fname" type="text" name="subject" id='fname' value={email.audienceId} disabled />
                                    <input className="fname"  placeholder="Enter subject*" type="text" name="subject" id='fname' onChange={(e) => {onValueChangeSecond(e)}} />
                                    <input className="lname" placeholder="Enter message body*" type="text" name="messageBody" id='lname'onChange={(e) => {onValueChangeSecond(e)}}/>
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


                        <div onClick={(e) => {closeAddForm(e)}}>
                        <div className={`popup-container ${isPopupVisible ? 'show' : ''}`} >
                            <div className="form-container" onClick={(e) => e.stopPropagation()}>
                                <h2 style={{ fontFamily: 'AktivGrotesk-Bold',  textAlign:'center' }}>Add a new audience</h2>
                                <form >
                                
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems:'center' }}>
                                <input className="lname" placeholder="Enter name*" type="text" name="name" onChange={(e) => {onValueChange(e)}}/>
                                <input className="lname" placeholder="Enter description*" type="text" name="description" onChange={(e) => {onValueChange(e)}}/>
                                <input className="lname" placeholder="Enter min total spend" type="number" name="minTotalSpend" onChange={(e) => {onValueChange(e)}}/>
                                <select className='fname' placeholde="Select customer" name='operator1'  onChange={(e)=>{onSelectValueChange1(e)}} >
                                                <>
                                                    <option style={{
                                                        background:'white',
                                                        color:'black',
                                                    }}
                                                    
                                                    value={`AND`}
                                                    >
                                                        {`AND`}
                                                    </option>

                                                    <option style={{
                                                        background:'white',
                                                        color:'black',
                                                    }}
                                                    
                                                    value={`OR`}
                                                    >
                                                        {`OR`}
                                                    </option>
                                            </>
                                    </select>
                                <input className="lname" placeholder="Enter min total visits" type="number" name="minTotalVisits" onChange={(e) => {onValueChange(e)}}/>


                                <select className='fname' placeholde="Select customer" name='operator2'  onChange={(e)=>{onSelectValueChange2(e)}} >
                                                <>
                                                    <option style={{
                                                        background:'white',
                                                        color:'black',
                                                    }}
                                                    
                                                    value={`AND`}
                                                    >
                                                        {`AND`}
                                                    </option>

                                                    <option style={{
                                                        background:'white',
                                                        color:'black',
                                                    }}
                                                    
                                                    value={`OR`}
                                                    >
                                                        {`OR`}
                                                    </option>
                                            </>
                                    </select>

                                <input className="lname" placeholder="Enter last unvisit months" type="number" name="lastMonthsNotVisited" onChange={(e) => {onValueChange(e)}}/>
                                    
                                        
                                        

                                    {/* <input className="fname"  placeholder="Enter customer id*" type="text" name="customerId" id='fname' onChange={(e) => {onValueChange(e)}} /> */}
                                    
                                </div>
                                {
                                    audienceSize !== ""?
                                    <>
                                    <div style={{
                                        width:'100%',
                                        fontSize:'20px',
                                        fontWeight:'600',
                                        textAlign:'center'
                                    }}>
                                        Audience Size is {audienceSize}
                                    </div>
                                    </>

                                    :
                                    <></>
                                }
                                <div className='btn' onClick={checkNewAudienceSizeApi}>Check audience size</div>
                                <div className='btn' onClick={addNewAudienceApi}>Add audience</div>
                                
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
                                    audiences && audiences.length > 0 ? 
                                    audiences.map(e => (
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
                                                   Title:
                                                </div>

                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'600',
                                                    marginLeft:'10px'
                                                }}>
                                                    {e.name}
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
                                                    Description:
                                                </div>

                                                <div style={{
                                                    fontSize:'20px',
                                                    fontWeight:'600',
                                                    marginLeft:'10px'
                                                }}>
                                                    {e.description}
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
                                                    Criteria:
                                                </div>

                                                <div style={{
                                                    display:'flex',
                                                    flexDirection:'row',
                                                    justifyContent:'space-between',
                                                    width:'85%',
                                                    marginLeft:'10px'
                                                }}>
                                                   <div style={{
                                                        display:'flex',
                                                        flexDirection:'column'
                                                   }}>
                                                        <div style={{
                                                            display:'flex',
                                                            flexDirection:'column',
                                                            alignItems:'center',
                                                            borderRadius:'5px',
                                                            color:'#12ae70',
                                                            textAlign:'center',
                                                            background:'#1d1d25',
                                                            padding:'5px'
                                                        }}>
                                                            Min total spend
                                                        </div>

                                                        <div style={{
                                                            textAlign:'center',
                                                            background:'#abd0f1',
                                                            borderRadius:'0px 0px 5px 5px',
                                                            color:'rgb(124 13 192)',
                                                            fontWeight:'650'
                                                        }}>
                                                            {e.criteria.minTotalSpend}
                                                        </div>
                                                   </div>

                                                   <div style={{
                                                        display:'flex',
                                                        alignItems:'center',
                                                        justifyContent:'center',
                                                        fontSize:'20px',
                                                        fontWeight:'800',
                                                        color:'#6378f5'
                                                   }}>
                                                        {e.criteria.operator1}
                                                   </div>

                                                    <div style={{
                                                        display:'flex',
                                                        flexDirection:'column'
                                                   }}>
                                                        <div style={{
                                                            display:'flex',
                                                            flexDirection:'column',
                                                            alignItems:'center',
                                                            borderRadius:'5px',
                                                            color:'#12ae70',
                                                            textAlign:'center',
                                                            background:'#1d1d25',
                                                            padding:'5px'
                                                        }}>
                                                            Min total visits
                                                        </div>

                                                        <div style={{
                                                            textAlign:'center',
                                                            background:'#abd0f1',
                                                            borderRadius:'0px 0px 5px 5px',
                                                            color:'rgb(124 13 192)',
                                                            fontWeight:'650'
                                                        }}>
                                                            {e.criteria.minTotalVisits}
                                                        </div>
                                                   </div>

                                                    <div style={{
                                                        display:'flex',
                                                        alignItems:'center',
                                                        justifyContent:'center',
                                                        fontSize:'20px',
                                                        fontWeight:'800',
                                                        color:'#6378f5'
                                                   }}>
                                                        {e.criteria.operator2}
                                                   </div>

                                                    <div style={{
                                                        display:'flex',
                                                        flexDirection:'column'
                                                   }}>
                                                        <div style={{
                                                            display:'flex',
                                                            flexDirection:'column',
                                                            alignItems:'center',
                                                            borderRadius:'5px',
                                                            color:'#12ae70',
                                                            textAlign:'center',
                                                            background:'#1d1d25',
                                                            padding:'5px'
                                                        }}>
                                                            Last unvisited months
                                                        </div>

                                                        <div style={{
                                                            textAlign:'center',
                                                            background:'#abd0f1',
                                                            borderRadius:'0px 0px 5px 5px',
                                                            color:'rgb(124 13 192)',
                                                            fontWeight:'650'
                                                        }}>
                                                            {e.criteria.lastMonthsNotVisited}
                                                        </div>
                                                   </div>

                                                    
                                                </div>
                                                
                                            </div>

                                            <div style={{
                                                display:'flex',
                                                flexDirection:'row',
                                                justifyContent:'space-between',
                                                marginTop:'2%'
                                            }}>
                                                <div style={{width:'30%', borderRadius:'5px', cursor:'pointer', color:'white', background:'#333367', padding:'5px', textAlign:'center'}} onClick={() => {navigate(`/audience/${e._id}/customers`)}}>
                                                    Get customers
                                                </div>

                                                <div style={{width:'30%', borderRadius:'5px', cursor:'pointer', color:'white', background:'#333367', padding:'5px', textAlign:'center'}} onClick={() => {openAddFormSecond( e._id, e.name)}}>
                                                    Send a campaign
                                                </div>

                                                <div style={{width:'30%', borderRadius:'5px', cursor:'pointer', color:'white', background:'#333367', padding:'5px', textAlign:'center'}}onClick={() => {navigate(`/audience/${e._id}/commslog`)}}>
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

export default Orders