import { useState } from "react";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

function WeatherWidget() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "a79c1027b55a25871d47273e58514cbe"; 

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found");
        }
        throw new Error("Error fetching data");
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchWeather();
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="text-white mb-4">🌤️ Weather Widget</h2>

          <div className="card dark-card mb-4">
            <div className="card-body">
              <div className="d-flex gap-3 align-items-center">
                <input
                  type="text"
                  className="form-control bg-dark text-white"
                  placeholder="Enter city name..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{ backgroundColor: "#1a1a1a", borderColor: "#404040" }}
                />
                <button
                  className="btn btn-primary"
                  onClick={fetchWeather}
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>
          </div>

          <div className="card dark-card">
            <div className="card-body">
              <h4 className="text-white mb-3">Weather Information</h4>

              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-light mt-2">Fetching weather...</p>
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle"></i> {error}
                </div>
              )}

              {weatherData && !loading && !error && (
                <div className="row">
                  <div className="col-12">
                    <div
                      className="p-4 text-center"
                      style={{
                        backgroundColor: "#1a1a1a",
                        borderRadius: "8px",
                        border: "1px solid #404040",
                      }}
                    >
                      <h3 className="text-white mb-3">{weatherData.name}</h3>

                      <img
                        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                        alt={weatherData.weather[0].description}
                        className="mb-3"
                        style={{ width: "100px", height: "100px" }}
                      />

                      <div className="mb-3">
                        <span
                          className="display-4 text-white"
                          style={{ fontWeight: "bold" }}
                        >
                          {Math.round(weatherData.main.temp)}°C
                        </span>
                      </div>

                      <p
                        className="text-light mb-3"
                        style={{ textTransform: "capitalize", fontSize: "18px" }}
                      >
                        {weatherData.weather[0].description}
                      </p>

                      <div className="d-flex justify-content-center">
                        <div
                          className="px-3 py-2"
                          style={{
                            backgroundColor: "#2d2d2d",
                            borderRadius: "6px",
                            border: "1px solid #404040",
                          }}
                        >
                          <span className="text-light">
                            💧 Humidity: {weatherData.main.humidity}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!weatherData && !loading && !error && (
                <div className="text-center py-4">
                  <p className="text-light">
                    Enter a city name above to get weather information! 🌍
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherWidget;