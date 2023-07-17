import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [devices, setDevices] = useState([]);
  const [etiquetas, setEtiquetas] = useState([])
  const [orden, setOrden] = useState('')

  useEffect(() => {
    setup();
  }, []);

  const data = async () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RpZ29DbGllbnRlIjoiMzE4MSIsInVzdWFyaW8iOiJqaW1teSIsImlhdCI6MTY4OTM2NTI3NSwiZXhwIjoxNjg5NDUxNjc1fQ.XZHt9Y5OF6y3XOVlA--DSFAZc6YB_oVYpOsYfFpMv-4");

    let raw = JSON.stringify({
      "tipoOrden": "1",
      "orden": `${orden}`
    });

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    let info = await fetch("http://localhost:44446/order/re-print", requestOptions)
    let a = await info.json()

    setEtiquetas(a)

  }


  const setup = () => {
    BrowserPrint.getDefaultDevice('printer', handleDefaultDevice, handleError);
  };

  const handleDefaultDevice = (device) => {
    setSelectedDevice(device);
    setDevices([device]);
    BrowserPrint.getLocalDevices(handleDeviceList, handleError, 'printer');
  };

  const handleDeviceList = (deviceList) => {
    const otherDevices = deviceList.filter((device) => !selectedDevice || device.uid !== selectedDevice.uid);
    setDevices((prevDevices) => [...prevDevices, ...otherDevices]);
  };

  const handleError = (error) => {
    alert(error);
  };

  const handleDeviceSelection = (event) => {
    const selectedDeviceUid = event.target.value;
    const device = devices.find((device) => device.uid === selectedDeviceUid);
    setSelectedDevice(device);
  };

  const writeToSelectedPrinter = (dataToWrite) => {

    console.log(etiquetas)
    if (etiquetas.length > 0) {
      for (const etiqueta of etiquetas) {
        console.log(etiqueta.tag)
        selectedDevice.send(etiqueta.tag, undefined, errorCallback);
      }
    }
  };

  const errorCallback = (errorMessage) => {
    alert('Error: ' + errorMessage);
  };

  return (
    <div>
      <h1>Zebra Browser Print Test Page</h1>
      <p>This page must be loaded from a web server to function properly.</p>

      <input
        onBlur={(e) => {
          setOrden(e.target.value)
        }}
      >

      </input>

      <button
        onClick={() => { data() }}
      >
        enviar
      </button>

      <br></br>

      <label htmlFor="selected_device">Selected Device: </label>
      <select id="selected_device" onChange={handleDeviceSelection}>
        {devices.map((device, index) => (
          <option key={index} value={device.uid}>
            {device.name}
          </option>
        ))}
      </select>

      <br></br>

      <button disabled={etiquetas.length > 0 ? false : true} onClick={() => writeToSelectedPrinter('^XA^FO50,50^A0N,50,50^FD¡adasda!^FS^FO50,150^BY2^B3N,100,Y,N^FD123456789^FS^XZ')}>
        Send ZPL Label
      </button>




    </div>
  )
}

export default App
