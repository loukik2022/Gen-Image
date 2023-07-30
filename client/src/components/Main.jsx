import React, { useState } from 'react';

export default function Main() {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('medium');
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setImageUrl('');

    if (prompt === '') {
      alert('Please add some text');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://localhost:3000/openai/generateimage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          size,
        }),
      });

      if (!response.ok) {
        throw new Error('Uh Oh! Image could not be generated');
      }

      const data = await response.json();
    //   console.log(data);

      const imageUrl = data.data;
      setImageUrl(imageUrl);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="showcase">
        <form id="image-form" onSubmit={handleSubmit}>
          <h1>AI Image Generator using Open AI</h1>
          <div className="form-control">
            <input
              type="text"
              id="prompt"
              placeholder="Describe Image"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          {/* size */}
          <div className="form-control">
            <select name="size" id="size" value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            Generate
          </button>
        </form>
      </div>

      <div className="image">
        <div className="image-container">
          <h2 className="msg">{error}</h2>
          <div className={`spinner ${loading ? 'show' : ''}`}></div>
          {imageUrl && !loading && <img src={imageUrl} alt="" id="image" />}
        </div>
      </div>

      <div className="spinner"></div>
    </div>
  );
}
