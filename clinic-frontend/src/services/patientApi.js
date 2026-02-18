export const addPatient = async (patient) => {
  await fetch("http://localhost:5000/add-patient", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patient),
  });
};
