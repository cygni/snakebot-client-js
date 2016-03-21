package communication

func (tile Tile) String() string {
	switch tile.Content {
	case "food":
		return "F"
	case "obstacle":
		return "O"
	case "snakebody":
		return "#"
	case "snakehead":
		return "@"
	default:
		return " "
	}
}
