import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddPatientPage() {
  const [formData, setFormData] = useState({
    name: {
      first: '',
      middle: '',
      last: '',
    },
    birthdate: '',
    gender: '',
    contactNumber: '',
    email: '',
    currentAddress: {
      country: 'Philippines',
      region: '',
      province: '',
      city: '',
      barangay: '',
      houseNumber: '',
      street: ''
    },
    permanentAddress: {
      country: 'Philippines',
      region: '',
      province: '',
      city: '',
      barangay: '',
      houseNumber: '',
      street: ''
    },
    medicalHistory: {
      allergies: [],
      conditions: [],
    },
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [field, subfield] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subfield]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/add-patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/patient-management');
      } else {
        setErrors(data.errors || {});
      }
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Patient</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" name="name.first" value={formData.name.first} onChange={handleChange} placeholder="First Name" required className="p-2 border rounded" />
            <input type="text" name="name.middle" value={formData.name.middle} onChange={handleChange} placeholder="Middle Name" className="p-2 border rounded" />
            <input type="text" name="name.last" value={formData.name.last} onChange={handleChange} placeholder="Last Name" required className="p-2 border rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required className="p-2 border rounded" />
            <select name="gender" value={formData.gender} onChange={handleChange} required className="p-2 border rounded">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" required className="p-2 border rounded" />
          </div>
          <div className="mt-4">
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className="p-2 border rounded w-full" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Current Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" name="currentAddress.houseNumber" value={formData.currentAddress.houseNumber} onChange={handleChange} placeholder="House Number" className="p-2 border rounded" />
            <input type="text" name="currentAddress.street" value={formData.currentAddress.street} onChange={handleChange} placeholder="Street" className="p-2 border rounded" />
            <input type="text" name="currentAddress.barangay" value={formData.currentAddress.barangay} onChange={handleChange} placeholder="Barangay" className="p-2 border rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <input type="text" name="currentAddress.city" value={formData.currentAddress.city} onChange={handleChange} placeholder="City" className="p-2 border rounded" />
            <input type="text" name="currentAddress.province" value={formData.currentAddress.province} onChange={handleChange} placeholder="Province" className="p-2 border rounded" />
            <input type="text" name="currentAddress.region" value={formData.currentAddress.region} onChange={handleChange} placeholder="Region" className="p-2 border rounded" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Permanent Address</h2>
          <div className="flex items-center mb-4">
            <input type="checkbox" id="sameAsCurrent" onChange={(e) => {
              if (e.target.checked) {
                setFormData(prev => ({ ...prev, permanentAddress: prev.currentAddress }));
              } else {
                setFormData(prev => ({ ...prev, permanentAddress: { country: 'Philippines', region: '', province: '', city: '', barangay: '', houseNumber: '', street: '' } }));
              }
            }} className="mr-2" />
            <label htmlFor="sameAsCurrent">Same as Current Address</label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" name="permanentAddress.houseNumber" value={formData.permanentAddress.houseNumber} onChange={handleChange} placeholder="House Number" className="p-2 border rounded" />
            <input type="text" name="permanentAddress.street" value={formData.permanentAddress.street} onChange={handleChange} placeholder="Street" className="p-2 border rounded" />
            <input type="text" name="permanentAddress.barangay" value={formData.permanentAddress.barangay} onChange={handleChange} placeholder="Barangay" className="p-2 border rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <input type="text" name="permanentAddress.city" value={formData.permanentAddress.city} onChange={handleChange} placeholder="City" className="p-2 border rounded" />
            <input type="text" name="permanentAddress.province" value={formData.permanentAddress.province} onChange={handleChange} placeholder="Province" className="p-2 border rounded" />
            <input type="text" name="permanentAddress.region" value={formData.permanentAddress.region} onChange={handleChange} placeholder="Region" className="p-2 border rounded" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Medical History</h2>
          <div className="space-y-2">
            <input type="text" name="medicalHistory.allergies" value={formData.medicalHistory.allergies} onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: { ...prev.medicalHistory, allergies: e.target.value.split(',') } }))} placeholder="Allergies (comma-separated)" className="p-2 border rounded w-full" />
            <input type="text" name="medicalHistory.conditions" value={formData.medicalHistory.conditions} onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: { ...prev.medicalHistory, conditions: e.target.value.split(',') } }))} placeholder="Existing Conditions (comma-separated)" className="p-2 border rounded w-full" />
          </div>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Patient</button>
      </form>
    </div>
  );
}
