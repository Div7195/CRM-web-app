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
            <div style={{
                display:'flex',
                flexDirection:'row',
                width:"100vw",
                height:"90vh"
            }}>
                    <Sidebar/>

                    <div style={{
                        width:'85%',
                        height:'100%',
                        display:'flex',
                        flexDirection:'column'
                    }}>
                        

                    </div>
            </div>
        </div>
        </>
    )
}

export default Home