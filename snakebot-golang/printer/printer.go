package printer

import (
	"fmt"

	"github.com/fatih/color"

	"../communication"
)

func printColored(tile communication.Tile, playerId string) {
	switch tile.Content {
	case "food":
		color.Set(color.FgRed)
	case "obstacle":
		color.Set(color.FgYellow)
	case "snakebody":
		if playerId == tile.PlayerId {
			color.Set(color.FgCyan)
		} else {
			color.Set(color.FgGreen)
		}
	case "snakehead":
		if playerId == tile.PlayerId {
			color.Set(color.FgCyan)
		} else {
			color.Set(color.FgGreen)
		}
	default:
		color.Set(color.FgBlack)
	}

	fmt.Print(tile)
}

func PrintMap(m communication.Map, playerId string) {
	for r, row := range m.Map {
		for c := range row {
			printColored(m.Map[c][r], playerId)
		}
		fmt.Print("\n")
	}
	color.Unset()
}
