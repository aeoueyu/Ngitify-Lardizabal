import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/edit-user/EditDentistPage.module.css'; // Reuse styles
import { useNavigate, useParams } from 'react-router-dom';
import { regions, provinces, cities, barangays } from '../../utils/addressData';
import successIcon from '../../assets/alert-icons/success.svg';

export default function EditPatientPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const fileInputRef = useRef(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isMinor, setIsMinor] = useState(false);
    const [errors, setErrors] = useState({});

    const initialAddressState = { country: 'Philippines', region: '', province: '', city: '', barangay: '', houseNumber: '', street: '' };

    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', birthdate: '',
        email: '', phone: '',
        currentAddress: { ...initialAddressState },
        permanentAddress: { ...initialAddressState },
        guardian: { name: '', relationship: '', contactNumber: '' },
        medicalHistory: { allergies: [], conditions: [], hospitalized: '', medications: '', surgeries: '' }
    });

    const allergyOptions = ['Local Anesthetic', 'Antibiotics', 'Sulfa Drugs', 'Aspirin', 'Latex', 'Dairy', 'Peanuts'];
    const conditionOptions = ['High Blood Pressure', 'Diabetes', 'Asthma', 'Heart Disease', 'Liver Disease', 'Epilepsy', 'Tuberculosis'];

    // FETCH DATA
    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user/${id}`); // Assuming generic user endpoint
                const data = await response.json();
                
                if (response.ok) {
                    const currentAddr = data.currentAddress || {};
                    const permAddr = data.permanentAddress || {};

                    // Check Age
                    const today = new Date();
                    const birthDate = new Date(data.birthdate);
                    let age = today.getFullYear() - birthDate.getFullYear();
                    if (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) age--;
                    setIsMinor(age < 13);

                    setFormData({
                        firstName: data.name?.first || '',
                        middleName: data.name?.middle || '',
                        lastName: data.name?.last || '',
                        birthdate: data.birthdate ? new Date(data.birthdate).toISOString().split('T')[0] : '',
                        email: data.email || '',
                        phone: data.contactNumber ? data.contactNumber.replace('+63', '') : '',
                        
                        currentAddress: {
                            country: 'Philippines',
                            region: currentAddr.region || '',
                            province: currentAddr.province || '',
                            city: currentAddr.city || '',
                            barangay: currentAddr.brgy || currentAddr.barangay || '',
                            street: currentAddr.street || '',
                            houseNumber: currentAddr.houseNumber || ''
                        },
                        permanentAddress: {
                            country: 'Philippines',
                            region: permAddr.region || '',
                            province: permAddr.province || '',
                            city: permAddr.city || '',
                            barangay: permAddr.brgy || permAddr.barangay || '',
                            street: permAddr.street || '',
                            houseNumber: permAddr.houseNumber || ''
                        },
                        guardian: data.guardian || { name: '', relationship: '', contactNumber: '' },
                        medicalHistory: data.medicalHistory || { allergies: [], conditions: [], hospitalized: '', medications: '', surgeries: '' }
                    });
                    setProfileImage(data.profileImage);
                } else {
                    alert("Failed to fetch patient data.");
                    navigate('/owner/manage-patients');
                }
            } catch (error) { console.error("Error:", error); } finally { setIsLoading(false); }
        };
        fetchPatient();
    }, [id, navigate]);

    // HANDLERS (Same as AddPatientPage mostly)
    
    // ... (include handleImageChange, triggerFileInput) ...
    // ... (include handlePersonalChange, handlePhoneChange, handleAddressChange, handleSameAddressToggle) ...

    const handleGuardianChange = (e) => {
        const { name, value } = e.target;
        const field = name.split('_')[1];
        setFormData(prev => ({ ...prev, guardian: { ...prev.guardian, [field]: value } }));
    };

    const handleCheckboxChange = (category, item) => {
        setFormData(prev => {
            const list = prev.medicalHistory[category] || []; // Ensure array exists
            const newList = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
            return { ...prev, medicalHistory: { ...prev.medicalHistory, [category]: newList } };
        });
    };

    const handleMedicalTextChange = (e) => {
        const { name, value } = e.target;
        const field = name.split('_')[1];
        setFormData(prev => ({ ...prev, medicalHistory: { ...prev.medicalHistory, [field]: value } }));
    };

    // SUBMIT (PUT Request)
    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... (Validate Form similar to AddPatientPage) ...

        const finalData = { ...formData, phone: `+63${formData.phone}`, profileImage };

        try {
            const response = await fetch(`http://localhost:5000/api/user/${id}`, { // Generic update
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            if (response.ok) setShowSuccessModal(true);
            else alert("Failed to update patient.");
        } catch (error) { console.error("Error:", error); }
    };

    // ... (Render logic - Copy AddPatientPage form but remove Passwords) ...
    // Make sure to populate fields with formData values
}