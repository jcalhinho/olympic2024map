import React from "react";

const AboutSection = () => {
  return (
    <div className="mt-8 h-full p-4 bg-gray-600 text-white"  style={{ background: 'linear-gradient(to bottom,#000428,#004e92  )' }}>
      <h2 className="text-2xl font-bold text-center mb-4">Who?</h2>
      <p>
        <a href="https://www.linkedin.com/in/jc-alhinho/" target="_blank" rel="noopener noreferrer">
          dev: linkedin.com/in/jc-alhinho/
        </a>
      </p>
    </div>
  );
};

export default AboutSection;