import React from 'react';

const ContactUs = () => {
  return (
    <div className="flex flex-col items-center py-10 md:py-20 bg-bg_gray">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold">
          Get in <span className="text-blue-500">Touch</span>
        </h1>
      </div>
      <div className="text-center mb-6 md:mb-12">
        <p className="text-sm md:text-base">Any Questions or Remarks? Just write us a message</p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 w-full px-4 md:px-12">
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={`${process.env.PUBLIC_URL}/images/contact-us-image.png`}
            alt="Contact Us"
            className="w-full md:w-3/4"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter name"
            className="border border-gray-300 rounded-md p-2 w-full text-sm md:text-base"
          />
          <input
            type="email"
            placeholder="Enter Email"
            className="border border-gray-300 rounded-md p-2 w-full text-sm md:text-base"
          />
          <textarea
            placeholder="Enter Description"
            className="border border-gray-300 rounded-md p-2 w-full h-32 resize-none text-sm md:text-base"
          />
        </div>
      </div>
      <div className='w-11/12 md:w-1/2 text-center bg-blue-700 text-white rounded-lg p-2 mt-8 cursor-pointer hover:bg-blue-500 active:text-blue-600 active:bg-blue-200 font-semibold'>
        Send
      </div>
    </div>
  );
};

export default ContactUs;
