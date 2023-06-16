import '../styles/Auth.css';
import { auth, provider } from '../firebase-config.js';
import { signInWithPopup } from 'firebase/auth';
import { Grid } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';


import Cookies from 'universal-cookie';
const cookies = new Cookies()
//per settare, prendere e rimuovere cookies dal browser

const Auth = (props) => {

    const { setIsAuth } = props;


    const signInWithGoogle = async () => {
        try {
            const res = await signInWithPopup(auth, provider);
            cookies.set('auth-token', res.user.refreshToken);
            setIsAuth(true);
            //oltre a settare il token di accesso imposto il reindirizzamento alla pagina per nominare la chatroom
            //passo setIsAuth da App.js come props e lo richiamo qui come true
        } catch (error) {
            console.log(error);
        }

    };


    return (
        <>

            <Grid
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                flexDirection="column"
            >
                <Grid
        marginBottom={2}
        color="orange"
                 >
                    <h1>
                        React Fire Chat 
                        <LocalFireDepartmentIcon 
                        style={{marginLeft: "10px",fontSize: "30px"}}
                        />
                    </h1>
                    
                </Grid>
                <Grid
                marginBottom={1}
                >
                    <p>
                        Sign In with Google to Continue:
                    </p>
                </Grid>

                <Grid>
                    <button 
                    className='auth-button'
                    onClick={signInWithGoogle}>
                        <GoogleIcon />
                    </button>
                </Grid>
            </Grid>
        </>

    );
};





export default Auth;