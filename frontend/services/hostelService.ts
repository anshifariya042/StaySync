export const addHostel = async (formData: FormData) => {
  const res = await fetch("http://localhost:5000/api/hostels/add-hostel", {
    method: "POST",
    body: formData,
  });

  return res.json();
};
