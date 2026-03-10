"use client";

import { useState } from "react";
import { addHostel } from "@/services/hostelService";

const AddHostelForm = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<FileList | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("location", location);
    formData.append("price", price);

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    const data = await addHostel(formData);

    console.log(data);
    alert("Hostel Added Successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <input
        type="text"
        placeholder="Hostel Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2"
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border p-2"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border p-2"
      />

      <input
        type="file"
        multiple
        onChange={(e) => setImages(e.target.files)}
      />

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded"
      >
        Add Hostel
      </button>

    </form>
  );
};

export default AddHostelForm;
