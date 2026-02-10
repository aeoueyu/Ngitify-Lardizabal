import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ViewPatientPage() {
  const [patient, setPatient] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/patients/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPatient(data);
        } else {
          console.error('Failed to fetch patient data');
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
      }
    };
    fetchPatient();
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">View Patient</h1>
        <button onClick={() => navigate('/patient-management')} className="bg-gray-500 text-white px-4 py-2 rounded">
          Back to List
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Name:</strong> {patient.name.first} {patient.name.middle} {patient.name.last}</p>
            <p><strong>Birthdate:</strong> {new Date(patient.birthdate).toLocaleDateString()}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Contact Number:</strong> {patient.contactNumber}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Current Address</h2>
          <p>{patient.currentAddress.houseNumber} {patient.currentAddress.street}, {patient.currentAddress.barangay}, {patient.currentAddress.city}, {patient.currentAddress.province}, {patient.currentAddress.region}, {patient.currentAddress.country}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Permanent Address</h2>
          <p>{patient.permanentAddress.houseNumber} {patient.permanentAddress.street}, {patient.permanentAddress.barangay}, {patient.permanentAddress.city}, {patient.permanentAddress.province}, {patient.permanentAddress.region}, {patient.permanentAddress.country}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Medical History</h2>
          <p><strong>Allergies:</strong> {patient.medicalHistory.allergies.join(', ')}</p>
          <p><strong>Conditions:</strong> {patient.medicalHistory.conditions.join(', ')}</p>
        </div>
      </div>
    </div>
  );
}
