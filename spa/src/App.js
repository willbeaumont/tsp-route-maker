import { useEffect, useState } from "react";
import "./index.css";
import { defaultAddresses, defaultEmbed } from "./defaultAddresses.js";

function EmbedMap(props) {
  return (
    <div className="w-full h-5/6">
      <iframe
        src={props.src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        title={props.title}
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

function AddressInput(props) {
  return (
    <div className="h-5/6">
      <div className="h-1/6 text-white grid text-4xl place-items-center text-center">
        <div>Route Optimizer</div>
        <div className="text-base">
          Enter the addresses you want to visit below!
        </div>
        <div className="text-base">
          Routes begin and end at the first address.
        </div>
      </div>
      <div className="flex flex-col w-full h-5/6 justify-center">
        {props.addresses.map((item) => (
          <input
            onChange={(e) => props.handler(e, item.id)}
            key={item.id}
            className="h-10 px-2 mx-3 my-1 bg-gray-300 rounded-md"
            value={item.address}
          ></input>
        ))}
      </div>
    </div>
  );
}

function Calculating() {
  return (
    <div className="w-full h-full grid place-items-center text-white text-5xl text-center">
      Retrieving the shortest route!
    </div>
  );
}

function Button(props) {
  return (
    <div
      className={"w-2/5 h-12 rounded-md grid place-items-center " + props.color}
    >
      <button className="w-full h-full" onClick={() => props.handler()}>
        {props.name}
      </button>
    </div>
  );
}

function cleanAddresses(addresses) {
  return addresses
    .map((item) => item.address)
    .filter((item) => item.trim() !== "");
}

function App() {
  const [addresses, setAddresses] = useState(defaultAddresses);
  const [embedUrl, setEmbedUrl] = useState(defaultEmbed);
  const [solution, setSolution] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const endpoint =
    "https://kavlc3z7e6.execute-api.us-west-1.amazonaws.com/prod/";

  const addressHandler = (event, id) => {
    let newAddresses = [...addresses];
    newAddresses = newAddresses.map((item) => {
      if (item.id === id) item.address = event.target.value;
      return item;
    });
    setAddresses(newAddresses);
  };

  const resetHandler = () => {
    if (solution) {
      setSolution(false);
    } else {
      let newAddresses = [...addresses];
      newAddresses = newAddresses.map((item) => {
        item.address = "";
        return item;
      });
      setAddresses(newAddresses);
    }
  };

  const tspHandler = () => {
    if (solution) {
      window.open(embedUrl[0], "_blank", "noreferrer");
    } else {
      const addressesCount = cleanAddresses(addresses).length;
      if (addressesCount > 2) {
        setCalculating(true);
      } else {
        alert(
          "There should be at least 3 addresses provided to calculate a route. " +
            addressesCount.toString() +
            " provided."
        );
      }
    }
  };

  useEffect(() => {
    if (calculating) {
      const bodyUpdate = JSON.stringify({
        addresses: cleanAddresses(addresses),
      });

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyUpdate,
      };
      
      fetch(endpoint, requestOptions)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          console.error("Reponse not OK")
          throw res;
        })
        .then((data) => {
          const parsedData = JSON.parse(data.body)
          setEmbedUrl(parsedData.urls);
          
          if (parsedData.badAddressIndex.length > 0) {
            const err_msg = "The following were not found and were omitted from the results--specify more details to include.\n"
            const err_addresses = parsedData.badAddressIndex
              .map(idx => "  " + cleanAddresses(addresses)[idx])
              .join("\n")
            alert(err_msg + err_addresses)
          }
          setSolution(true);
        })
        .catch((error) => {
          console.error("Error fetching: ", error);
        })
        .finally(() => {
          setCalculating(false);
        });
    }
  }, [calculating, solution, addresses]);

  return (
    <div className="w-screen h-screen bg-gray-800 flex flex-col">
      <div className="w-full h-full">
        {calculating ? (
          <Calculating />
        ) : solution ? (
          <EmbedMap src={embedUrl[1]} title="tsp_route" />
        ) : (
          <AddressInput addresses={addresses} handler={addressHandler} />
        )}
        {!calculating ? (
          <div className="h-1/6 w-full flex items-center justify-evenly">
            <Button
              color="bg-red-700"
              name={solution ? "Reset" : "Empty List"}
              handler={resetHandler}
            />
            <Button
              color="bg-green-600"
              name={solution ? "Go to Maps" : "Get Fastest Route"}
              handler={tspHandler}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
