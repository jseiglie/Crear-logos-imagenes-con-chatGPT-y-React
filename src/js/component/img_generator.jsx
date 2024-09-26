import React, { useState } from "react";

export const ImgGenerator = () => {

    const [brandname, setBrandname] = useState('');
    const [colorScheme, setColorScheme] = useState('');
    const [style, setStyle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setImageUrl('')
        const prompt = `A ${style} logo for the brand called "${brandname}" making use of this colors as the color scheme ${colorScheme}.`
        try {
            const resp = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer' //añadir API KEY de openAI dejando un espacio entre la llave y el Bearer, ej: Bearer skasdasdasd
                },
                body: JSON.stringify({
                    prompt, n: 1, size: '1024x1024'
                })
            });
            if (!resp.ok) throw new Error('Error generando la imagen, intentalo de nuevo');
            const data = await resp.json()
            console.log(data)
            setImageUrl(data.data[0].url)
            setLoading(false)
        } catch (error) {
            setError(error)
            setLoading(false)
        }
    }

    return (
        <section>
            <form onSubmit={handleSubmit} className='container d-flex flex-column'>
                <label className='my-3'>
                    Brandname:
                    <input type="text" onChange={e => setBrandname(prev => prev = e.target.value)} />
                </label>
                <label className='my-3'>
                    Color scheme:
                    <input type="text" onChange={e => setColorScheme(prev => prev = e.target.value)} />
                </label>
                <label className='my-3'>
                    Estilo del logo:
                    <select onChange={e => setStyle(prev => prev = e.target.value)}>
                        <option value="minimalist">Minimalista</option>
                        <option value="modern">Modern</option>
                        <option value="retro">Retro</option>
                        <option value="abstract">Abstracto</option>
                    </select>
                </label>
                <div>
                    <input type="submit" value="Generar Logo" className='btn btn-primary' />
                </div>
            </form>
            {
                loading && <div className='container bg-secondary'><h3>Loading</h3></div>
            }
            {error && <div className='container bg-danger'>{error}</div>}
            {
                imageUrl &&
                <figure>
                    <img className='img-fluid' src={imageUrl} alt={`${brandname}'s logo`} />
                    <figcaption>Generated Logo for {brandname}</figcaption>
                </figure>
            }
        </section>
    )
} 