// src/data/patients.js

export const mockPatients = [
    { 
        id: "1", 
        name: "John Doe", 
        age: 35,
        gender: "Male",
        lastVisit: "2023-10-15",
        status: 'active',
        branch: 'Parañaque',
        medicalHistory: "None",
        allergies: "None"
    },
    { 
        id: "2", 
        name: "Jane Smith", 
        age: 29,
        gender: "Female",
        lastVisit: "2023-11-01",
        status: 'active',
        branch: 'Las Piñas',
        medicalHistory: "Asthma",
        allergies: "Peanuts"
    }
];

export const findPatientById = (id) => {
    return mockPatients.find(p => p.id === id);
};
