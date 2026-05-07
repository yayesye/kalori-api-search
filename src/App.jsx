import { useState, useEffect } from "react";
import axios from "axios";

export default function App () {

	const [FoodData, setFoodData] = useState()
	const [Search, setSearch] = useState()
	const debouncedSearch = useDebounce(Search, 400)

	const KALORI_API_KEY = import.meta.env.VITE_KALORI_API_KEY

	function useDebounce(value, delay) {
  	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		// Set a timer to update the debounced value after the delay
		const handler = setTimeout(() => {
		setDebouncedValue(value);
		}, delay);

		// Clean up the timer if the value changes (before the delay finishes)
		return () => { 
			clearTimeout(handler) 
		};
	}, [value, delay]);

	return debouncedValue;
	}

	useEffect ( ()=> {
		async function getData() {

			// check first if debouncedSearch is there, if not there, then it won't fetch
			const response = debouncedSearch && await fetch(`https://api.kalori-api.my/api/v1/foods/search?q=${debouncedSearch}`, {
				method: 'GET',
				headers: {"X-API-Key": KALORI_API_KEY}
			})

			const test = structuredClone(await response.json())

			setFoodData(test.data)
		}

		getData()
	},[debouncedSearch])
	
	// FoodData && console.log(FoodData)

	return(
		<div className="w-full min-h-screen flex flex-col items-center bg-[#1F1F1F] p-10">
			{/* this is the search bar */}
			<div className="bg-amber-400 p-3 mb-8 flex items-center w-screen md:max-w-2/3 ">
				<i className="fas fa-magnifying-glass fa-xl mr-10 "></i>
				<input onChange={(e)=>{setSearch(e.target.value)}} className=" outline-none caret-amber-800 w-full " type="text" placeholder="Food" />
			</div>
			

			{/* this is the style of the shown boxes */}

			{FoodData && FoodData.map(fud => (
				<div key={fud.id} className="bg-amber-200 p-5 outline-2 min-w-[60vw] hover:bg-amber-300 ">
					<h1 className="font-bold">{fud.name} </h1>
					<p>Calories: {fud.calories} </p>
				</div>
			))}

		</div>
  	)
}