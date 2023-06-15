import { auth, provider } from '../firebase-config.js';
import { signInWithPopup } from 'firebase/auth';

import Cookies from 'universal-cookie';
const cookies = new Cookies()
//per settare, prendere e rimuovere cookies dal browser

const Auth = (props) => {

    const {setIsAuth} = props;


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
        <div className='auth'>
            <p>
                Sign In with Google to Continue
            </p>
            <button onClick={signInWithGoogle}>
                Sign In with Google
            </button>
        </div>
    );
};





export default Auth;