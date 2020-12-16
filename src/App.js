import React, {useEffect, useState} from 'react';
import './App.css';
import DragNDrop from './components/DragNDrop'

function App() {

  /** Setting state variables - "data" variable holds the single source of truth */
  const [data, setData] = useState([]);  

  /** Setting state variables - Data currently on a dropdown (subset of "data") */
  const [dropdown, setDropdown] = useState([]);

    /* Refactor/Filter out the data sent from the API **/
    const refactorData = (response) => {
      let newData = response["Project"] && response["Project"].map((arr,arrI)=>{
        arr['key'] = arrI;
        arr['Checks'] = arr['Tasks'].map((el)=> {
          return {
            check : false,
            value : el
          }
        });
        delete(arr['Tasks']);
        return arr
      });
      return newData;
    }

    /** Call API during the page loads */
    useEffect(() => {
      fetch(
        `https://demo0242938.mockable.io/todo`,
        {
          method: "GET",
          headers: new Headers({
            Accept: "application/json"
          })
        }
      )
        .then(res => res.json())
        .then(response => {
          let newData = refactorData(response);
          console.log(newData,"refactored Data");
          setData(newData);
          newData.length && setDropdown(newData[0]);
        })
        .catch(error => console.log(error));
      },[]);

      /** Callback function from the child component to update the single source of truth "data" variable */
      const setDataFromShuffle = (newShuffled) => {
        let shuffledList = data && data.map((oldShuffled)=> {
          if(oldShuffled.key === newShuffled.key)
            return newShuffled;
            else
            return oldShuffled
        })
        setData(shuffledList);
      }

 
  return (
    <div className="App">
      {/* Dropdown JSX */}
      <div>
        {"Project - "} 
      <select 
        value={dropdown.key} 
        onChange={(e) => setDropdown(data[e.target.value])} 
        className = "dropdown"
      >
        {
          data.map((datum)=> {
            return <option key={datum.key} value={datum.key}>{datum.Name}-{datum.key}</option>
          })
        }
      </select>
      </div>   
      {/* Calling draggable child cards */}
      <header className="App-header">
        <DragNDrop data={dropdown} shuffleData = {setDataFromShuffle}/>
      </header>
    </div>
  );
}

export default App;