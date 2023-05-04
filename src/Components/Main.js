import React, { useState } from "react";

const apiKey = "faaf8f9251dbea43452bf49727530c82";

function App() {
    const [inputVal, setInputVal] = useState("");
    const [cities, setCities] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    const handleInputChange = (event) => {
        setInputVal(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const listItemsArray = cities.map((city) => city.name.toLowerCase());

        if (listItemsArray.includes(inputVal.toLowerCase())) {
            setErrorMsg(
                `You already know the weather for ${inputVal}...otherwise be more specific by providing the country code as well`
            );
            setInputVal("");
            return;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                const { main, name, sys, weather } = data;
                console.log(main['humidity'])
                const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;

                const city = {
                    name: `${name}, ${sys.country}`,
                    temp: Math.round(main.temp),
                    humidity: main['humidity'],
                    icon: icon,
                    description: weather[0]["description"],
                };

                setCities([...cities, city]);
                setInputVal("");
            })
            .catch(() => {
                setErrorMsg("Please search for a valid city");
            });
    };

    return (
        <>
            <div className="top-banner">
                <h1 class="heading">Simple Weather App</h1>
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="text"
                        placeholder="Enter city name"
                        value={inputVal}
                        onChange={handleInputChange}
                    />
                    <button type="submit">Search</button>
                </form>
                {errorMsg && <div className="msg">{errorMsg}</div>}
            </div>
            <div className="ajax-section">
                <ul className="cities">
                    {cities.map((city, index) => (
                        <li key={index} className="city">
                            <h2 className="city-name" data-name={city.name}>
                                <span>{city.name.split(",")[0]}</span>
                                <sup>{city.name.split(",")[1]}</sup>
                            </h2>
                            <div className="city-temp">
                                {city.temp}
                                <sup>°C</sup>
                            </div>
                            <div className="city-humidity">
                                <sup>humidity</sup>
                                {city.humidity}
                                <sup>rh</sup>
                            </div>
                            <figure>
                                <img className="city-icon" src={city.icon} alt={city.description} />
                                <figcaption>{city.description}</figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default App;