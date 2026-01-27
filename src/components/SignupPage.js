import React , { use, useEffect, useState }from "react";
import styles from '../styles/SignupPage.module.css';
import logo from '../assets/logo-greenpink.svg';
import googlelogo from '../assets/google-logo.png';
import bgElement from '../assets/bg-element.svg';
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
    const [ fullname , setFullname ] = useState('');
    const [ email , setEmail ] = useState('');
    const [ birthday , setBirthday ] = useState('');
    const [ contactNumber , setContactNumber ] = useState('');
    const [ currentAddress , setCurrentAddress ] = useState({
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
            if (password != confirmPassword) {
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
    })

    const isSignupDisabled = passStrength === 'WEAK' || passStrength === '' || password != confirmPassword;

    const handleNameChange = (e)=>{
        const val = e.target.value;
        const cleanValue = val.replace(/[^a-zA-Z\s.]/g,"");
        setFullname(cleanValue);
    }

    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [ errorMessage , setErrorMessage ] = useState("");

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
                            placeholder='Enter your birthday'
                            className={styles['input-field']}
                            value={birthday}
                        />
                    </div>
                </div>
                <div className={styles['addresslabel-container']}>
                    <p className={styles['addresslabel']}>ADDRESS</p>
                </div>
                <div className={styles['row-field']}>
                    <div className={styles['field']}>
                        <input
                            type='text'
                            placeholder='House No.'
                            className={styles['input-field']}
                        />
                    </div>
                    <div className={styles['field']}>
                        <input
                            type='text'
                            placeholder='Street Name'
                            className={styles['input-field']}
                        />
                    </div>
                </div>
                <div className={styles['row-field']}> 
                    <div className={styles['field']}>
                        <select className={styles['input-field']}>
                            <option value=''>Select Region</option>
                            <option value='NCR'>NCR</option>
                            <option value='NCR'>Region I</option>
                        </select>
                    </div>
                    <div className={styles['field']}>
                        <select className={styles['input-field']}>
                            <option value=''>Select Province</option>
                            <option value='Metro Manila'>Metro Manila</option>
                            <option value='Cavite'>Cavite</option>
                        </select>
                    </div>
                </div>
                <div className={styles['row-field']}> 
                    <div className={styles['field']}>
                        <select className={styles['input-field']}>
                            <option value=''>Select City</option>
                            <option value='Pasay City'>Pasay City</option>
                            <option value='Imus'>Imus</option>
                        </select>
                    </div>
                    <div className={styles['field']}>
                        <select className={styles['input-field']}>
                            <option value=''>Select Barangay</option>
                            <option value='Barangay 1'>Barangay 1</option>
                            <option value='Barangay 2'>Barangay 2</option>
                        </select>
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
                <button className={styles['signup-button']} disabled={isSignupDisabled}>
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