import { useState, useEffect } from 'preact/hooks';
import { isPrime } from "../scripts/utils"

export default function ThreeNPrimes() {
	const [noOfColumns, setNoOfColumns] = useState(10)
	const [rowCounts, setRowCounts] = useState([1, 2])
	useEffect(() => {
		if (noOfColumns > 10000) {
			setNoOfColumns(10000)
			return
		}
		const rowCounts = [0, 0]
		for (let i = 0; i < noOfColumns; i++) {
			if (isPrime(3 * i + 1)) {
				rowCounts[0]++
			} else if (isPrime(3 * i + 2)) {
				rowCounts[1]++
			}
		}
		setRowCounts(rowCounts)
	}, [noOfColumns])
	return <div class="border-container">
		<div>Number of columns: <input value={noOfColumns} onKeyUp={(e) => setNoOfColumns(e.target.value)} /></div>
		<p>Number of primes in the top row: <strong>{rowCounts[0]}</strong> (probability {rowCounts[0] / noOfColumns * 100}%)</p>
		<p>Number of primes in the middle row: <strong>{rowCounts[1]}</strong> (probability {rowCounts[1] / noOfColumns * 100}%)</p>


	</div>
}