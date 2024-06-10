import '../css/home.css'
import Sidebar from './Sidebar'
const Home = () => {
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
            <div className='classA'>
                    <Sidebar/>

                    <div className='classB'>
                <div style={{
                display:'flex',flexDirection:'column',width:'100%'
                }}>

                <div className="sub-boxx">

                    <div style={{
                        fontSize:'40px'
                    }}>
                         Internship Assignment Task
                    </div>
                    <div style={{
                        fontSize:'70px',
                        fontWeight:'700',
                        color:'#04274a'
                    }}>
                        Mini CRM Application
                    </div>
                    
                    <div style={{
                        fontSize:'25px'
                    }}>
                        Facilities To Manage Customers, Orders
                    </div>
                    <div style={{
                        fontSize:'25px'
                    }}>
                        Facilities To Send Campaigns
                    </div>
                </div>

                <div className='classC'>
                    <img style={{width:'60%',
                    height:'70%',
                     borderRadius:'80px'}} src='https://i0.wp.com/lemonlearning.com/wp-content/uploads/2023/01/CRM-1-scaled.jpg?fit=2560%2C1707&ssl=1'/>

                </div>
            </div>
                    </div>
                    </div>
            </div>
        
        </>
    )
}

export default Home