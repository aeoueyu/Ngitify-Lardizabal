import React , { useEffect, useState }from "react";
import styles from '../styles/SignupPage.module.css';
import logo from '../assets/logo-greenpink.svg';
import googlelogo from '../assets/google-logo.png';
import bgElement from '../assets/bg-element.svg';
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
    const navigate = useNavigate();
    
    const [ fullname , setFullname ] = useState('');
    const [ email , setEmail ] = useState('');
    const [ birthday , setBirthday ] = useState('');
    const [ contactNumber , setContactNumber ] = useState('');
    const [ address , setAddress ] = useState({
        houseNum: '',
        street: '',
        region: '',
        province: '',
        city: '',
        brgy: '',
    });
    const [ password , setPassword ] = useState('');
    const [ confirmPassword , setConfirmPassword ] = useState('');
    const [ passStrength , setPassStrength ] = useState('');

    useEffect(()=>{
        if (password || confirmPassword) {
            if (password !== confirmPassword) {
                setErrorMessage('Passwords do not match.');
            }
            else {
                setErrorMessage('');
            }

            if (password.length === 0) {
                setPassStrength('');
            }
            else if (password.length < 6) {
                setPassStrength('WEAK');
            }
            else if (password.length >= 6 && /[0-9]/.test(password) && /[A-Z]/.test(password)) {
                setPassStrength('STRONG');
            }
            else {
                setPassStrength('MODERATE');
            }
        }
    }, [password,confirmPassword]);

    const handleNameChange = (e)=>{
        const val = e.target.value;
        const cleanValue = val.replace(/[^a-zA-Z\s.]/g,"");
        setFullname(cleanValue);
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isOldEnough = ()=>{
        if (!birthday) return false;
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 21;
    }

    const getMaxBirthday = () => {
        const today = new Date();
        const maxDate = new Date(
            today.getFullYear() - 21,
            today.getMonth(),
            today.getDate()
        );
        return maxDate.toISOString().split("T")[0];
    };

    const isAddressComplete = Object.values(address).every(value => value.trim() !== '');

    const isSignupDisabled =
        !fullname ||
        !isEmailValid ||
        contactNumber.length !==10 ||
        !isOldEnough() ||
        !isAddressComplete ||
        passStrength === 'WEAK' ||
        passStrength === '' ||
        password !== confirmPassword;

    const [ errorMessage , setErrorMessage ] = useState("");

    const handleSignup = async (e)=>{
        const userData = {
            fullname,
            email,
            contactNumber: `+63${contactNumber}`,
            address,
            password
        };

        try {
            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/email-verification');
            }
            else {
                setErrorMessage(data.message);
            }
        }
        catch (err) {
            setErrorMessage('Cannot connect to server.');
        }
    };

    return (
        <div className={styles['main-container']}>
            <img src={logo} alt='Lardizabal Dental Clinic' className={styles.logo}/>
            <img src={bgElement} alt='background element' className={styles['bg-element']}/>
            <div className={styles.container}>
                <div className={styles['page-title']}>
                    <p>SIGNUP TO</p>
                    <p className={styles['ngitify-title']}>NGITIFY</p>
                </div>
                <div className={styles['row-field']}>
                    <div className={styles.field}>
                        <div className={styles['label-container']}>
                            <p className={styles.label}>FULL NAME</p>
                        </div>
                        <input
                            type='text'
                            placeholder='Enter your full name'
                            className={styles['input-field']}
                            value={fullname}
                            onChange={handleNameChange}
                        />
                    </div>
                    <div className={styles.field}>
                        <div className={styles['label-container']}>
                            <p className={styles.label}>EMAIL</p>
                        </div>
                        <input
                            type='email'
                            placeholder='Enter your email'
                            className={styles['input-field']}
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div className={styles['row-field']}>
                    <div className={styles.field}>
                        <div className={styles['label-container']}>
                            <p className={styles.label}>CONTACT NUMBER</p>
                        </div>
                        <div className={styles['contact-input-wrapper']}>
                            <span className={styles['prefix']}>+63</span>
                            <input
                                type='number'
                                className={styles['contact-input']}
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value.slice(0,10))}
                                placeholder='10 digit contact number'
                            />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <div className={styles['label-container']}>
                            <p className={styles.label}>BIRTHDAY</p>
                        </div>
                        <input
                            type='date'
                            className={`${styles['input-field']} ${birthday ? styles['has-value'] : ''}`}
                            value={birthday}
                            onChange={(e)=>setBirthday(e.target.value)}
                            max={getMaxBirthday()}
                        />
                    </div>
                </div>
                <div className={styles['addresslabel-container']}>
                    <p className={styles['addresslabel']}>ADDRESS</p>
                </div>
                <div className={styles['row-field']}> 
                    <div className={styles['field']}>
                        <select
                            className={styles['input-field']}
                            required
                            value={address.region}
                            onChange={(e)=>setAddress({...address,region:e.target.value})}
                            style={{color: address.region === '' ? '#CFCFCF' : 'black'}}
                        >
                            <option value='' disabled hidden>Select Region</option>
                            <option value='NCR'>NCR</option>
                            <option value='Region I'>Region I</option>
                        </select>
                    </div>
                    <div className={styles['field']}>
                        <select
                            className={styles['input-field']}
                            required
                            value={address.province}
                            onChange={(e)=>setAddress({...address,province:e.target.value})}
                            style={{color: address.province === '' ? '#CFCFCF' : 'black'}}
                        >
                            <option value='' disabled hidden>Select Province</option>
                            <option value='Metro Manila'>Metro Manila</option>
                            <option value='Cavite'>Cavite</option>
                        </select>
                    </div>
                </div>
                <div className={styles['row-field']}> 
                    <div className={styles['field']}>
                        <select
                            className={styles['input-field']}
                            required
                            value={address.city}
                            onChange={(e)=>setAddress({...address,city:e.target.value})}
                            style={{color: address.city === '' ? '#CFCFCF' : 'black'}}
                        >
                            <option value='' disabled hidden>Select City</option>
                            <option value='Pasay City'>Pasay City</option>
                            <option value='Imus'>Imus</option>
                        </select>
                    </div>
                    <div className={styles['field']}>
                        <select
                            className={styles['input-field']}
                            required
                            value={address.brgy}
                            onChange={(e)=>setAddress({...address,brgy:e.target.value})}
                            style={{color: address.brgy === '' ? '#CFCFCF' : 'black'}}
                        >
                            <option value='' disabled hidden>Select Barangay</option>
                            <option value='Barangay 1'>Barangay 1</option>
                            <option value='Barangay 2'>Barangay 2</option>
                        </select>
                    </div>
                </div>
                <div className={styles['row-field']}>
                    <div className={styles['field']}>
                        <input
                            type='text'
                            placeholder='House No.'
                            className={styles['input-field']}
                            required
                            value={address.houseNum}
                            onChange={(e)=>setAddress({...address,houseNum:e.target.value})}
                        />
                    </div>
                    <div className={styles['field']}>
                        <input
                            type='text'
                            placeholder='Street Name'
                            className={styles['input-field']}
                            required
                            value={address.street}
                            onChange={(e)=>setAddress({...address,street:e.target.value})}
                        />
                    </div>
                </div>
                <div className={styles['row-field']}>
                    <div className={styles.field}>
                        <div className={styles['label-container']}>
                            <p className={styles.label}>PASSWORD</p>
                        </div>
                        <input
                            type='password'
                            placeholder='Enter your password'
                            className={styles['input-field']}
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <div className={styles['label-container']}>
                            <p className={styles.label}>CONFIRM PASSWORD</p>
                        </div>
                        <input
                            type='password'
                            placeholder='Enter your password'
                            className={styles['input-field']}
                            value={confirmPassword}
                            onChange={(e)=>setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>
                {passStrength && (
                            <span className={`${styles.strength} ${styles[passStrength.toLowerCase()]}`}>
                                {passStrength}
                            </span>
                )}
                <div className={styles.error}>
                    {errorMessage}
                </div>
                <button className={styles['signup-button']} disabled={isSignupDisabled} onClick={handleSignup}>
                    SIGN UP
                </button>
                <button className={styles['googlesignup-button']}>
                    <div className={styles['googlesignup-container']}>
                        <img src={googlelogo} className={styles['google-logo']}/>
                        <p className={styles['googlesignup-label']}>SIGN UP WITH YOUR GOOGLE ACCOUNT</p>
                    </div>
                </button>
                <div className={styles['login-container']}>
                    <p className={styles['login-label']}>
                        Already have an account? <a href="/login" className="login-link">Login</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}