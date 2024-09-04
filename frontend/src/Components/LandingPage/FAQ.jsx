import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const FAQ = ({ faqs, answers }) => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {faqs.map((faq, index) => (
        <div key={index} className="mb-6">
          <div
            className="flex items-center p-4 bg-gray-200 rounded-lg shadow-md cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
            onClick={() => toggleFAQ(index)}
          >
            {openFAQ === index ? (
              <RemoveIcon className="text-yellow-400 mr-3 text-base md:text-lg lg:text-xl" />
            ) : (
              <AddIcon className="text-yellow-400 mr-3 text-base md:text-lg lg:text-xl" />
            )}
            <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-800">
              {faq}
            </h3>
          </div>
          {openFAQ === index && (
            <div className="p-4 bg-gray-100 rounded-lg shadow-md mt-2">
              <p className="text-sm md:text-base lg:text-lg text-gray-700">
                {answers[index]}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
