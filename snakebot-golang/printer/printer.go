package printer

import (
	"fmt"

	"../communication"
)

func PrintMap(m communication.Map) {
	for r, row := range m.Map {
		for c := range row {
			fmt.Print(m.Map[c][r])
		}
		fmt.Print("\n")
	}
}
